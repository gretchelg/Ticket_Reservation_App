import type {Booking, TicketCounter} from "$lib/entities/models";
import * as db from "$lib/server/data_sources/counters";
import {TicketType} from "$lib/entities/values";
import * as errors from "$lib/entities/errors";
import {error} from "@sveltejs/kit";

const idStandardTickets = "standard_tickets";
const idVIPTickets = "vip_tickets";
const idYouthTickets = "youth_tickets";

// generic Get
export async function GetByID (id: string): Promise<TicketCounter | null> {
    return await db.GetByID(id)
}


export async function GetStandardTickets (): Promise<TicketCounter | null> {
    return await GetByID(idStandardTickets)
}

// increment the values as given. Possible to decrement by using negative values.
export async function IncrementStandardTickets (values: {
    available: number,
    reserved: number,
    sold: number,
}): Promise<void> {
    await IncrementTickets(idStandardTickets, values)
}

export async function GetVIPTickets (): Promise<TicketCounter | null> {
    return await GetByID(idVIPTickets)
}

// increment the values as given. Possible to decrement by using negative values.
export async function IncrementVIPTickets (values: {
    available: number,
    reserved: number,
    sold: number,
}): Promise<void> {
    await IncrementTickets(idVIPTickets, values)
}

export async function GetYouthTickets (): Promise<TicketCounter | null> {
    return await GetByID(idYouthTickets)
}

// increment the values as given. Possible to decrement by using negative values.
export async function IncrementYouthTickets (values: {
    available: number,
    reserved: number,
    sold: number,
}): Promise<void> {
    await IncrementTickets(idYouthTickets, values)
}

// increment the values as given. Possible to decrement by using negative values.
export async function IncrementTickets (id: string, values: { 
    available: number,
    reserved: number,
    sold: number,
}): Promise<void> {
    await db.Increment(id, values)
}

// IncrementTicketCounters increments the appropriate ticket counters (i.e.: standard or vip) based on the booking details
export async function IncrementTicketCounters(booking: Booking, delta: {available: number, reserved: number, sold: number}): Promise<void> {
    let incrementTicketFunction = null
    switch (booking.ticket_type) {
        case TicketType.STANDARD:
            incrementTicketFunction = IncrementStandardTickets
            break
        case TicketType.VIP:
            incrementTicketFunction = IncrementVIPTickets
            break
        case TicketType.YOUTH:
            incrementTicketFunction = IncrementYouthTickets
            break
        default:
            throw error(400, `Invalid ticket type ${booking.ticket_type} on booking ${booking.reference_no}`)
    }

    await incrementTicketFunction(delta)
}