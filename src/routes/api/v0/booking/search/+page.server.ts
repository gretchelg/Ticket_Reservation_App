import type { Booking } from "$lib/entities/models"
import * as bookingWorkflows from "$lib/server/workflows/bookings";


export const load = (async (event) => {
    // get url from the query param
    const referenceNo = event.url.searchParams.get('reference_no')
    if (!referenceNo) {
        // empty url? nothing to do (likely an initial page load)
        console.log("[INFO] no reference_no received")
        return {
            bookings: [],
            noneFound: false, 
        }
    }

    // TODO do search
    const aBooking = await bookingWorkflows.GetByID(referenceNo)
    console.log("[INFO] search completed")

    // nothing found
    if (!aBooking){
        return {
            bookings: [],
            noneFound: true, 
        }
    }

    // return result
    let result: Booking[] = [aBooking]

    return {
        bookings: result,
        noneFound: false, 
    }
})

// actions handle Form Actions
export const actions = {
    markPaid: markPaid
}

async function markPaid({ request }) {
    // get inputs
    const formData = await request.formData()

    const referenceNo = formData.get("reference_no")

    // TODO bookingWorkflows.MarkAsPaid()
    console.log("[INFO] marked as paid refNo", referenceNo)

    // delete ticket
    // await ticketWorkflows.DeleteByID(id)

    // redirect client to the ticket list page
    // throw redirect(303, '/api/v0/ticket');
}