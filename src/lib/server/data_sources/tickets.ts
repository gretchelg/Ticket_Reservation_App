import * as mongoose from "mongoose";
import type { Ticket } from "$lib/entities/models"
// import { convertTicketStatus } from "$lib/entities/values";

const ticketSchema = new mongoose.Schema({
    ticket_id: {
        type: String,
    },
    name: {
        type: String,
    },
    ticket_type: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
    },
    is_paid: {
        type: Boolean,
    },
    booking_reference_no: {
        type: String,
    },
    checkin_qr_code_image_url: {
        type: String,
    },
})

const dbCollection = await mongoose.model("Ticket1", ticketSchema)

export async function Insert(ticket: Ticket): Promise<string> {
    const dbRecord = convertModelToDBSchema(ticket)
    await dbCollection.create(dbRecord)

    return ticket.ticket_id
}

export async function GetByID(ticket_id: string): Promise<Ticket | null> {
    const aTicket = await dbCollection.findOne({ticket_id: ticket_id})

    // not found
    if (!aTicket){
        console.log(`[ERROR] DB: GetByID(${ticket_id}) Not Found`)
        return null
    }

    return convertDBSchemaToModel(aTicket)
}

export async function GetAll(): Promise<Ticket[]> {
    const tickets = await dbCollection.find({})

    if (!tickets){
        return []
    }

    const result: Ticket[] = []
    for (const ticket of tickets){
        result.push(convertDBSchemaToModel(ticket))
    }

    return result

}

export async function UpdateStatus(ticket_id: string, value: string): Promise<void> {
    const patchData = { status: value }

    await Patch(ticket_id, patchData)
}

async function Patch(ticket_id: string, patchData: object): Promise<void> {
    // create filter
    const filter = { ticket_id: ticket_id }

    // do the patch
    await dbCollection.findOneAndUpdate(filter, patchData)
}


export async function UpdateByID(ticket_id: string, delta: Ticket): Promise<void> {
    console.log("[INFO] TODO implement UpdateByID()", ticket_id, delta)
    return
}

export async function DeleteByID(ticket_id: string): Promise<void> {
    console.log("[INFO] TODO implement DeleteByID()", ticket_id)
    return
}

// convert DBSchema -> Model
function convertDBSchemaToModel(dbSchema): Ticket {
    // ensure enums are valid
    // const ticketStatus = convertTicketStatus(dbSchema.status)

    // respond with real Ticket object
    return {
        ticket_id: dbSchema.ticket_id,
        name: dbSchema.name,
        ticket_type: dbSchema.ticket_type,
        description: dbSchema.description,
        status: dbSchema.status,
        is_paid: dbSchema.is_paid,
        booking_reference_no: dbSchema.booking_reference_no,
        checkin_qr_code_image_url: dbSchema.checkin_qr_code_image_url,
    }
}


// convert Model -> DBSchema
function convertModelToDBSchema(model: Ticket) {
    return {
        ticket_id: model.ticket_id,
        name: model.name,
        ticket_type: model.ticket_type,
        description: model.description,
        status: model.status,
        is_paid: model.is_paid,
        booking_reference_no: model.booking_reference_no,
        checkin_qr_code_image_url: model.checkin_qr_code_image_url,
    }
}

