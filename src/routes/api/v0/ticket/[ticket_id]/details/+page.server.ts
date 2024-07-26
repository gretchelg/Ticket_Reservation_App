// Ticket defines the type/schema for a Ticket business object
import type { Ticket, QRCode } from "$lib/entities/models"
import * as ticketWorkflows from "$lib/server/workflows/tickets";
import {error} from "@sveltejs/kit";

export type ServerData = {
    aTicket: Ticket,
    checkin: QRCode,
}

export async function load({ params }): Promise<ServerData> {
    // get inputs
    let ticket_id = params.ticket_id

    // get ticket
    const aTicket: Ticket | null = await ticketWorkflows.GetByID(ticket_id)

    if (!aTicket){
        throw error(404, "ticket not found")
    }

    // get related QR code used for checking
    const qrCode: QRCode = await ticketWorkflows.GetCheckinQRCode(aTicket.ticket_id, aTicket.booking_reference_no)

    // send page data
    return {
        aTicket: aTicket,
        checkin: qrCode,
    }
}
