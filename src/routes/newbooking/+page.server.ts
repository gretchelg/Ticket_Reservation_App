import {error, redirect} from '@sveltejs/kit';

import type { TicketCounter } from "$lib/entities/models"
import * as workflows from "$lib/server/workflows/bookings";
import * as ticketCounterWorkflows from "$lib/server/workflows/ticket_counters";
import * as errors from "$lib/entities/errors"

export type ServerData = {
    standardTicketCounter: TicketCounter,
    vipTicketCounter: TicketCounter,
    youthTicketCounter: TicketCounter,
}

export async function load({ event, params }): Promise<ServerData> {
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

    // redirect to sold out page if no more tickets available
    if (standardTicketCounter.available <= 0 &&
        vipTicketCounter.available <= 0 &&
        youthTicketCounter.available <= 0

    ) {
        throw redirect(303, "/newbooking/soldout")
    }

    // send page data
    return {
        standardTicketCounter: standardTicketCounter,
        vipTicketCounter: vipTicketCounter,
        youthTicketCounter: youthTicketCounter,
    }}

// actions handle Form Actions
export const actions = {
    // "default" handles form="submit" action
    default: createBooking 
}

async function createBooking({ request, fetch }) {
    // receive form data values
    const formData = await request.formData()

    const name = formData.get("name")
    const email = formData.get("email")
    const city = formData.get("city")
    const ticket_type = formData.get("ticket_type")

    const strQuantity = formData.get("quantity")
    const intQuantity = parseInt(strQuantity)
    if (isNaN(intQuantity)){
        throw error(400, "quantity is not numeric")
    }

    // if (intQuantity < 1){
    //     throw error(400, "select how many tickets")
    // }


    const guests = []
    for (let i = 1; i <= intQuantity; i++){
        const keyName = "guest_" + i
        const guestData = formData.get(keyName)
        guests.push(guestData)
    }

    // create booking
    const details = {
        name: name,
        email: email,
        city: city,
        ticket_type: ticket_type,
        quantity: intQuantity,
        guests: guests,
    }
    await workflows.CreateNew(details)

    // redirect to success page
    throw redirect(303, '/newbooking/success');
}