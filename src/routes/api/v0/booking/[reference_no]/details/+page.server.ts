import {error, redirect} from '@sveltejs/kit';

// Ticket defines the type/schema for a Ticket business object
import type { Booking } from "$lib/entities/models"
import * as bookingWorkflows from "$lib/server/workflows/bookings";
import * as emailWorkflows from "$lib/server/workflows/emails";

export async function load({ params }): Promise<{aRecord: Booking | null}> {
    // get dynamic route param
    let reference_no = params.reference_no

    // get booking
    const aBooking: Booking | null = await bookingWorkflows.GetByID(reference_no)

    if (!aBooking){
        throw error(404, "booking not found")
    }

    // send page data
    return {
        aRecord: aBooking,
    }
}

// actions handle Form Actions
export const actions = {
    markPaid: markPaid,
    generateTickets: generateTickets,
    sendTicketsEmail: sendTicketsEmail,
    sendPaymentReminderEmail: sendPaymentReminderEmail
}

async function markPaid({ request, params }) {
    const referenceNo = params.reference_no
    await bookingWorkflows.MarkPaid(referenceNo)
}

async function generateTickets({ params }) {
    const referenceNo = params.reference_no
    await bookingWorkflows.GenerateRelatedTickets(referenceNo)
}

async function sendTicketsEmail({ params }) {
    const referenceNo = params.reference_no
    await emailWorkflows.SendTicketsEmail((referenceNo))

    throw redirect(303, 'details/email_success');
}

async function sendPaymentReminderEmail({ params }) {
    const referenceNo = params.reference_no
    await emailWorkflows.SendPaymentReminder((referenceNo))

    throw redirect(303, 'details/email_success');
}