import * as mongoose from "mongoose";
import type { Booking } from "$lib/entities/models"
// import {BookingPaymentStatus, TicketType, convertTicketType } from "$lib/entities/values"

const bookingSchema = new mongoose.Schema({
    reference_no: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    ticket_type: {
        type: String,
        required: true
    },
    book_date: {
        type: Date,
        required: true
    },
    payment_status: {
        type: String,
        required: true
    },
    amount_total: {
        type: String,
        required: true
    },
    guests: [
        {
            type: String,
            required: true
        }
    ],
    ticket_ids: [
        {
            type: String,
            required: true
        }
    ]
});

const dbCollection = await mongoose.model("Booking", bookingSchema)

// Insert inserts a new record in the database.
export async function Insert(booking: Booking): Promise<Booking> {
    await dbCollection.create(booking)
    return booking
}

// GetByID gets a record by the given ID
export async function GetByID(reference_no: string): Promise<Booking | null> {
    const aBooking = await dbCollection.findOne({reference_no: reference_no})

    // not found
    if (!aBooking){
        console.log(`[ERROR] DB: GetByID(${reference_no}) Not Found`)
        return null
    }

    return convertDBSchemaToModel(aBooking)
}

// GetByID gets a record by the given ID
export async function GetAll(): Promise<Booking[]> {
    const bookings = await dbCollection.find({})

    // console.log("[DEBUG] DB: GetAll() result: ", bookings)
    if (!bookings){
        return []
    }

    const result: Booking[] = []
    for (const booking of bookings){
        result.push(convertDBSchemaToModel(booking))
    }

    return result
}

export async function UpdatePaymentStatus(reference_no: string, value: string): Promise<void> {
    // create filter
    const filter = { reference_no: reference_no }

    // create patch data
    const patch = { payment_status: value }

    // do the patch
    await dbCollection.findOneAndUpdate(filter, patch)

    console.log("[INFO] Success UpdatePaymentStatus()")
}

export async function AppendTicketID(reference_no: string, ticket_id: string): Promise<void> {
    // do the patch
    await dbCollection.updateOne(
        { reference_no: reference_no },
        { $push: { ticket_ids: ticket_id },
        },
    )

    console.log("[INFO] Success AppendTicketID()")
}

// converts DB Schema => Model
function convertDBSchemaToModel(dbSchema): Booking {
    // ensure enums are valid
    // const paymentStatus: BookingPaymentStatus = convertBookingPaymentStatus(dbSchema.payment_status)
    // const ticketType: TicketType = convertTicketType(dbSchema.ticket_type)

    // respond with real Booking object
    return {
        reference_no: dbSchema.reference_no,
        name: dbSchema.name,
        email: dbSchema.email,
        city: dbSchema.city,
        ticket_type: dbSchema.ticket_type,
        book_date: dbSchema.book_date,
        payment_status: dbSchema.payment_status,
        amount_total: dbSchema.amount_total,
        guests: dbSchema.guests,
        ticket_ids: dbSchema.ticket_ids,
    }
}

