
import * as bookingWorkflows from "$lib/server/workflows/bookings";
import type { Booking } from "$lib/entities/models";

export type ServerData = {
    bookings: Booking[],
}

export async function load({}): Promise<ServerData> {
    const bookings: Booking[]  = await bookingWorkflows.List()

    if (!bookings) {
        return {
            bookings: [],
        }
    }

    return {
        bookings: bookings,
    }
}
