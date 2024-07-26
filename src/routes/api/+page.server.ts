import {error} from '@sveltejs/kit';

import type {TicketCounter} from "$lib/entities/models"
import * as ticketCounterWorkflows from "$lib/server/workflows/ticket_counters";
import * as errors from "$lib/entities/errors";


export type ServerData = {
    standardTicketCounter: TicketCounter,
    vipTicketCounter: TicketCounter,
    youthTicketCounter: TicketCounter,
}

export async function load({ params }): Promise<ServerData> {

    // get ticket counters
    let standardTicketCounter: TicketCounter | null
    let vipTicketCounter: TicketCounter | null
    let youthTicketCounter: TicketCounter | null
    try {
        standardTicketCounter = await ticketCounterWorkflows.GetStandardTickets()
        vipTicketCounter = await ticketCounterWorkflows.GetVIPTickets()
        youthTicketCounter = await ticketCounterWorkflows.GetYouthTickets()
    } catch (e) {
        if (e === errors.ERR_DB_TIMEOUT) {
            throw error(503, "Server is busy. Please Refresh and try again.")
        }

        throw e
    }

    // handle empty cases
    if (!standardTicketCounter) {
        throw error(404, 'standard ticket counter is missing')
    }

    if (!vipTicketCounter) {
        throw error(404, 'vip ticket counter is missing')
    }

    if (!youthTicketCounter) {
        throw error(404, 'youth ticket counter is missing')
    }

    // send page data
    return {
        standardTicketCounter: standardTicketCounter,
        vipTicketCounter: vipTicketCounter,
        youthTicketCounter: youthTicketCounter,
    }
}

// actions handle Form Actions
export const actions = {
    add10ToAvailableStandardTickets: add10ToAvailableStandardTickets,
    add10ToAvailableVIPTickets: add10ToAvailableVIPTickets,
    add10ToAvailableYouthTickets: add10ToAvailableYouthTickets,
}

async function add10ToAvailableStandardTickets({ request, params }) {
    await ticketCounterWorkflows.IncrementStandardTickets({available: 10, reserved: 0, sold: 0})
}


async function add10ToAvailableVIPTickets({ request, params }) {
    await ticketCounterWorkflows.IncrementVIPTickets({available: 10, reserved: 0, sold: 0})
}

async function add10ToAvailableYouthTickets({ request, params }) {
    await ticketCounterWorkflows.IncrementYouthTickets({available: 10, reserved: 0, sold: 0})
}