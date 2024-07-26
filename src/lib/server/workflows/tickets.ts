// Module workflows/tickets contains "business logic" related to Ticket objects.
// This keeps business logic centralized, letting other modules focus on their core responsibilities.
// Example: HTTP handlers can focus on read requests and send replies over HTTP.

import { env } from '$env/dynamic/private'
const APP_BASE_URL = env.APP_BASE_URL

import * as qrcodegen from "$lib/server/utils/qrcodegen"
import base64 from "base-64"
import type { Ticket, QRCode } from "$lib/entities/models"
import {
    TicketCanCheckIn,
    TicketCanCheckOut,
    ConvertTicketType,
    TicketStatus,
    TicketType
} from "$lib/entities/values"
import * as db from "$lib/server/data_sources/tickets";
import * as media_storage from "$lib/server/external_services/cloudinaryService";
import * as random from "$lib/server/utils/random";
import {error} from "@sveltejs/kit";
import {Booking} from "$lib/entities/models";
import * as bookingWorkflows from "$lib/server/workflows/bookings";
import * as eventloggger from "$lib/server/external_services/eventlogger";

// CreateNew creates a new record from the given details and inserts it into the DB.
// It returns the full newly created object (the caller probably wants to see the generated ID).
export async function CreateNew(opts: {
    name: string,
    ticket_type: string,
    description: string,
    booking_reference_no: string,
    is_paid: boolean,
}): Promise<Ticket> {
    // you may want to do some validation first here

    // ensure valid values
    const ticketType: TicketType = ConvertTicketType(opts.ticket_type)

    // gen new ID
    const ticketID = generateTicketID()

    // create checkin QR code
    const qrCode: QRCode = await GetCheckinQRCode(ticketID, opts.booking_reference_no)

    // upload QR Code image to cloud storage
    const qrCodeImageURL = await media_storage.UploadImage(qrCode.imageData)

    // instantiate a new Ticket
    const aNewTicket: Ticket = {
        ticket_id: ticketID,
        name: opts.name,
        ticket_type: ticketType,
        description: opts.description,
        status: TicketStatus.CREATED,
        is_paid: opts.is_paid,
        booking_reference_no: opts.booking_reference_no,
        checkin_qr_code_image_url: qrCodeImageURL,
    }

    // save to DB
    await db.Insert(aNewTicket)

    // log the event
    eventloggger.Log("TICKET_CREATED", "TODO", {
        ticket_id: aNewTicket.ticket_id,
        ticket_guest_name: aNewTicket.name,
        related_booking_reference_no: aNewTicket.booking_reference_no,
    })

    // return the full inserted object
    return aNewTicket
}

// GetByID gets a ticket by ID and returns it
export async function GetByID(ticket_id: string): Promise<Ticket | null> {
   return await db.GetByID(ticket_id)
}

// CheckIn sets the ticket's status to checked-in
export async function CheckIn(ticket_id: string): Promise<void> {
    // get ticket and booking
    const {ticket, booking} =  await GetTicketAndBooking(ticket_id)

    // validate if permitted to check in
    const canDoCheckIn = TicketCanCheckIn(booking, ticket)

    if (!canDoCheckIn) {
        throw error(400, "ticket state is not allowed for check in")
    }

    // do update
    await db.UpdateStatus(ticket_id, TicketStatus.CHECKED_IN)

    // log the event
    eventloggger.Log("TICKET_CHECKED_IN", "TODO", {
        ticket_id: ticket.ticket_id,
        ticket_guest_name: ticket.name,
        related_booking_reference_no: ticket.booking_reference_no,
    })
}

// CheckOut sets the ticket's status to checked-out
export async function CheckOut(ticket_id: string): Promise<void> {
    // get ticket and booking
    const {ticket, booking} =  await GetTicketAndBooking(ticket_id)

    // validate if permitted to check in
    const canDoCheckOut = TicketCanCheckOut(booking, ticket)

    if (!canDoCheckOut) {
        throw error(400, "ticket state is not allowed for check out")
    }

    // do update
    await db.UpdateStatus(ticket_id, TicketStatus.CHECKED_OUT)

    // log the event
    eventloggger.Log("TICKET_CHECKED_OUT", "TODO", {
        ticket_id: ticket.ticket_id,
        ticket_guest_name: ticket.name,
        related_booking_reference_no: ticket.booking_reference_no,
    })
}

// GetTicketAndBooking returns the ticket and booking objects for a given ticket_id. This pair is often needed together.
async function GetTicketAndBooking(ticket_id: string): Promise<{ticket: Ticket, booking: Booking}> {
    // get ticket
    const aTicket: Ticket | null = await GetByID(ticket_id)

    if (!aTicket){
        throw error(404, "ticket not found")
    }

    // get booking
    const aBooking: Booking | null = await bookingWorkflows.GetByID(aTicket.booking_reference_no)

    if (!aBooking){
        throw error(404, "booking not found")
    }

    return {ticket: aTicket, booking: aBooking}
}


// DeleteByID Deletes a ticket identified by ID
export async function DeleteByID(ticket_id: string): Promise<void> {
    await db.DeleteByID(ticket_id)
}

// List lists all tickets available. filter is unused at the moment.
export async function GetAll(): Promise<Ticket[]> {
    return await db.GetAll()
}

// GetCheckinQRCode returns a QR code image for the given ticket
export async function GetCheckinQRCode(ticket_id: string, booking_reference_no: string): Promise<QRCode> {
    // generate some token we MIGHT find useful later
    const rawToken = `${booking_reference_no}:${ticket_id}`
    const encodedToken = base64.encode(rawToken);

    const url = `${APP_BASE_URL}/api/v0/ticket/${ticket_id}/checkin?token=${encodedToken}`
    const qrCodeImage = await qrcodegen.GenerateQRCodeImage(url);

    // send image to the caller
    return {
        imageData: qrCodeImage,
        targetURL: url,
    }
}

// generate a ticket id in the format TXXX-XXXX
function generateTicketID(): string {
    const part1 = random.GenerateRandomIDWithSize(3)
    const part2 = random.GenerateRandomIDWithSize(4)

    return `T${part1}-${part2}`
}
