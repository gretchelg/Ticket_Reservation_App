import {error, redirect} from '@sveltejs/kit';

import type {Booking, QRCode, Ticket} from "$lib/entities/models"
import * as bookingWorkflows from "$lib/server/workflows/bookings";

export type ServerData = {
    booking: Booking | null,
    ticketsData: {
        ticket: Ticket,
        qrCodeData: QRCode,
    }[]
}

export async function load({ params }): Promise<ServerData> {
    // get dynamic route param
    let reference_no = params.reference_no

    // get booking
    const aBooking: Booking | null = await bookingWorkflows.GetByID(reference_no)

    if (!aBooking){
        throw error(404, "booking not found")
    }

    // get tickets + their QR Codes
    const ticketsData  = await bookingWorkflows.GetRelatedTicketsWithCheckinQRCode(reference_no)

    // send page data
    return {
        booking: aBooking,
        ticketsData: ticketsData,
    }
}

// actions handle Form Actions
// export const actions = {
//     markPaid: markPaid,
//     generateTickets: generateTickets
// }

// async function markPaid({ request, params }) {
//     const referenceNo = params.reference_no
//     await bookingWorkflows.MarkPaid(referenceNo)
// }

// async function generateTickets({ params }) {
//     const referenceNo = params.reference_no
//     await bookingWorkflows.GenerateRelatedTickets(referenceNo)
// }