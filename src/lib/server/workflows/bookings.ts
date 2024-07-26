import * as db from "$lib/server/data_sources/bookings";
import type {Booking, QRCode, Ticket} from "$lib/entities/models"
import { BookingPaymentStatus, TicketPrice, TicketType } from "$lib/entities/values"
import * as values from "$lib/entities/values"
import * as emailWorkflows from "$lib/server/workflows/emails";
import * as ticketWorkflows from "$lib/server/workflows/tickets";
import * as counterWorkflows from "$lib/server/workflows/ticket_counters";

import {error} from "@sveltejs/kit"
import * as random from "$lib/server/utils/random";
import * as eventloggger from "$lib/server/external_services/eventlogger";

export async function CreateNew(booking: {
    name: string,
    email: string,
    city: string,
    ticket_type: string,
    quantity: number,
    guests: string[],
}): Promise<void> {
    // validate
    if (booking.guests.length > 10) {
        throw error(400, "validation failed: guests can't be > 10")
    }

    // ensure valid values only
    const ticketType: TicketType = values.ConvertTicketType(booking.ticket_type)

    // calculate total
    const amount_total = computeTotalAmountDue(ticketType, booking.guests.length)

    // build booking details
    const newBooking: Booking = {
        reference_no: generateBookingReferenceNo(),
        name: booking.name,
        email: booking.email,
        city: booking.city,
        ticket_type: ticketType,
        book_date: Date.now().toString(),
        payment_status: BookingPaymentStatus.UNPAID,
        amount_total: amount_total,
        guests: booking.guests,
        ticket_ids: [],
    }

    // create booking
    const createdBooking: Booking = await db.Insert(newBooking)

    // update ticket counter
    if (ticketType == "STANDARD") {
        const standardTicket = await counterWorkflows.GetStandardTickets();
        if (standardTicket) {
            const standardCounter = {
                available: -booking.quantity,
                reserved: booking.quantity,
                sold: 0,
            }
            await counterWorkflows.IncrementStandardTickets(standardCounter)
        }
    }

    if (ticketType == "VIP") {
        const VIPTicket = await counterWorkflows.GetVIPTickets();
        if (VIPTicket) {
            const VIPCounter = {
                available: -booking.quantity,
                reserved: booking.quantity,
                sold: 0,
            }
            await counterWorkflows.IncrementVIPTickets(VIPCounter)
        }
    }

    if (ticketType == "YOUTH") {
        const youthTicket = await counterWorkflows.GetYouthTickets();
        if (youthTicket) {
            const youthCounter = {
                available: -booking.quantity,
                reserved: booking.quantity,
                sold: 0,
            }
            await counterWorkflows.IncrementYouthTickets(youthCounter)
        }
    }

        // send email confirmation
        await emailWorkflows.SendBookingConfirmation(createdBooking)

    // log the event
    eventloggger.Log("BOOKING_RESERVATION_CREATED", createdBooking.email, {
        booking_reference_no: createdBooking.reference_no,
        count: booking.guests.length,
        ticket_type: ticketType,
    })
}

export async function GetByID(reference_no: string): Promise<Booking | null> {
    const aBooking: Booking | null = await db.GetByID(reference_no)
    return aBooking
}


export async function List(): Promise<Booking[]> {
    return await db.GetAll()
}

export async function MarkPaid(reference_no: string): Promise<void> {
    // retrieve booking
    const aBooking: Booking | null = await GetByID(reference_no)
    if (!aBooking) {
        throw error(404, "Booking not found")
    }

    const booking: Booking = aBooking

    // validate if it CAN be paid
    const canBePaid = values.BookingCanBeMarkedAsPaid(booking)
    if (!canBePaid){
        throw error(400, "Booking cannot be further marked as paid")
    }

    // update payment status
    await db.UpdatePaymentStatus(booking.reference_no, BookingPaymentStatus.PAID)

    // log the event
    eventloggger.Log("BOOKING_MARKED_AS_PAID", "TODO", {
        booking_reference_no: booking.reference_no,
        email: booking.email,
        payment_status: BookingPaymentStatus.PAID,
    })

    // update ticket counters
    const numOfGuests = booking.guests.length
    const delta = {
        available: 0,
        reserved: -numOfGuests,
        sold: +numOfGuests,
    }

    await counterWorkflows.IncrementTicketCounters(booking, delta)
}

// generate new tickets and link them to the given booking. Returns the list of generated ticket_ids
// throws on error
export async function GenerateRelatedTickets(reference_no: string): Promise<string[]> {
    // ensure Booking exists
    const booking = await GetByID(reference_no)
    if (!booking) {
        throw error(404, "Booking not found")
    }

    // NOTE: in the case of 'partially generated tickets', we won't know which guests have which tickets.
    // Therefore, we either (A) generate all tickets, or (B) generate none.

    // ensure booking is allowed to generate tickets
    const canGenerateTickets = values.BookingCanGenerateTickets(booking)
    if (!canGenerateTickets){
        throw error(400, "Booking is in a state where it cannot generate tickets")
    }

    // if all tickets are already generated, nothing to do
    const allTicketsGenerated = booking.ticket_ids.length >= booking.guests.length
    if (allTicketsGenerated) {
        return
    }

    // generate new Tickets
    const generatedTicketIDs: string[] = []

    for (const guest of booking.guests) {

        // generate ticket
        const details = {
            name: guest,
            ticket_type: booking.ticket_type,
            description: "", // unused for now
            booking_reference_no: reference_no,
            is_paid: true, // by default, all tickets are paid
        }
        const generatedTicket = await ticketWorkflows.CreateNew(details)

        // append the ticket_id to the booking
        await db.AppendTicketID(reference_no, generatedTicket.ticket_id)

        // log the event
        eventloggger.Log("TICKET_APPENDED_TO_BOOKING", "TODO", {
            booking_reference_no: booking.reference_no,
            booking_email: booking.email,
            related_ticket_id: generatedTicket.ticket_id,
            related_ticket_guest_name: generatedTicket.name,
        })

        generatedTicketIDs.push(generatedTicket.ticket_id)
    }

    return generatedTicketIDs
}

export async function GetRelatedTicketsWithCheckinQRCode(reference_no: string): Promise<{ticket: Ticket, qrCodeData: QRCode}[]> {
    const tickets =  await GetRelatedTickets(reference_no)

    const result: {
        ticket: Ticket,
        qrCodeData: QRCode,
    }[] = []
    for (const ticket of tickets) {
        const qrCodeData: QRCode = await ticketWorkflows.GetCheckinQRCode(ticket.ticket_id, reference_no)
        result.push({
            ticket: ticket,
            qrCodeData: qrCodeData
        })
    }

    return result
}

export async function GetRelatedTickets(reference_no: string): Promise<Ticket[]> {
    // retrieve booking
    const booking = await GetByID(reference_no)
    if (!booking) {
        throw error(404, "Booking not found")
    }

    // get related tickets
    const result: Ticket[] = []
    for (const ticket_id of booking.ticket_ids) {

        const aTicket: Ticket | null = await ticketWorkflows.GetByID(ticket_id)
        if (!aTicket) {
            continue
        }

        result.push(aTicket)
    }

    return result
}

export async function CancelBookingReservation(reference_no: string): Promise<void> {
    // retrieve booking
    const booking: Booking | null = await GetByID(reference_no)
    if (!booking) {
        throw error(404, "Booking not found")
    }

    // validate status
    if (!values.BookingCanBeCancelled(booking)) {
        throw error(400, "Only UNPAID Bookings can be cancelled")
    }

    // update status to cancelled
    await db.UpdatePaymentStatus(reference_no, BookingPaymentStatus.BOOKING_RESERVATION_CANCELLED)

    // log the event
    eventloggger.Log("BOOKING_RESERVATION_CANCELLED", "TODO", {
        booking_reference_no: booking.reference_no,
        booking_email: booking.email,
        ticket_type: booking.ticket_type,
        count: booking.guests.length,
    })

    // release the reserved tickets to be available
    const numOfGuests = booking.guests.length
    const ticketCounterDelta = {
        available: +numOfGuests,
        reserved: -numOfGuests,
        sold: 0,
    }

    await counterWorkflows.IncrementTicketCounters(booking, ticketCounterDelta)
}


function computeTotalAmountDue(ticketType: TicketType, quantity: number): number {
    switch (ticketType){
        case TicketType.VIP:
            return TicketPrice.VIP * quantity
        case TicketType.STANDARD:
            return TicketPrice.STANDARD * quantity
        case TicketType.YOUTH:
            return TicketPrice.YOUTH * quantity
        default:
            return TicketPrice.STANDARD * quantity
    }
}

// generate a booking reference number in ther format BXX-XXX-X
function generateBookingReferenceNo(): string {
    const part1 = random.GenerateRandomIDWithSize(3)
    const part2 = random.GenerateRandomIDWithSize(4)

    return `B${part1}${part2}`
}