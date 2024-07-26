import {error} from '@sveltejs/kit';

// Ticket defines the type/schema for a Ticket business object
import type {Booking, TicketCounter} from "$lib/entities/models"
import * as ticketCounterWorkflows from "$lib/server/workflows/ticket_counters";
import {ERR_DB_TIMEOUT} from "$lib/entities/errors";


export type ServerData = {
    ticketCounter: TicketCounter,
}

export async function load({ params }): Promise<ServerData> {
    // get dynamic route param
    const id = params._id

    // get ticket counter
    const ticketCounter = await ticketCounterWorkflows.GetByID(id)

    if (!ticketCounter) {
        throw error(404, 'ticket counter does not exist')
    }

    // send page data
    return {
        ticketCounter: ticketCounter,
    }
}

// actions handle Form Actions
export const actions = {
    incrementAvailableCount: incrementAvailableCount,
}

async function incrementAvailableCount({ request, params }) {
    const id = params._id
    await ticketCounterWorkflows.IncrementTickets(id, {available: 10, reserved: 0, sold: 0})
}