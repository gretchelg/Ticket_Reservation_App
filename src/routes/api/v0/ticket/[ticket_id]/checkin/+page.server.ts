// Ticket defines the type/schema for a Ticket business object
import type {Ticket, QRCode, Booking} from "$lib/entities/models"
import * as ticketWorkflows from "$lib/server/workflows/tickets";
import * as bookingWorkflows from "$lib/server/workflows/bookings";
import {error} from "@sveltejs/kit";

export type ServerData = {
    aTicket: Ticket,
    aBooking: Booking,
}

export async function load({ params }): Promise<ServerData> {
    // get inputs
    let ticket_id = params.ticket_id

    // get ticket
    const aTicket: Ticket | null = await ticketWorkflows.GetByID(ticket_id)

    if (!aTicket){
        throw error(404, "ticket not found")
    }

    // get booking
    const aBooking: Booking | null = await bookingWorkflows.GetByID(aTicket.booking_reference_no)

    if (!aBooking){
        throw error(404, "booking not found")
    }

    // send page data
    return {
        aTicket: aTicket,
        aBooking: aBooking,
    }
}

export const actions = {
    checkIn: checkIn,
    checkOut: checkOut,
}

async function checkIn({ params }) {
    let ticket_id = params.ticket_id
    await ticketWorkflows.CheckIn(ticket_id)
}

async function checkOut({ params }) {
    let ticket_id = params.ticket_id
    await ticketWorkflows.CheckOut(ticket_id)
}
