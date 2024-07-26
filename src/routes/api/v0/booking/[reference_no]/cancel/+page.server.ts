import {error, redirect} from '@sveltejs/kit';

// Ticket defines the type/schema for a Ticket business object
import type { Booking } from "$lib/entities/models"
import * as bookingWorkflows from "$lib/server/workflows/bookings";
import * as emailWorkflows from "$lib/server/workflows/emails";
import {CancelBookingReservation} from "$lib/server/workflows/bookings";

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
    cancelBooking: cancelBooking,
}

async function cancelBooking({ request, params }) {
    const reference_no = params.reference_no

    await bookingWorkflows.CancelBookingReservation(reference_no)

    redirect(303, `/api/v0/booking/${reference_no}/cancel/cancel_success`)
}

