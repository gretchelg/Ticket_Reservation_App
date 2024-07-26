// Models is a module that defines schema for our Business Entities (e.g.: ticket, booking, user, etc)

import {BookingPaymentStatus, TicketStatus, TicketType} from "$lib/entities/values"

export type Booking = {
    reference_no: string
    name: string
    email: string // TODO needs to be validated
    city: string
    ticket_type: TicketType
    book_date: string
    payment_status: BookingPaymentStatus
    amount_total: number // in EUR always
    guests: string[]
    ticket_ids: string[]
}

export type Ticket = {
    ticket_id: string
    name: string
    ticket_type: TicketType
    description: string
    status: TicketStatus
    is_paid: boolean
    booking_reference_no: string
    checkin_qr_code_image_url: string
}

// Email defines an email to be sent to a user
export type Email = {
    from: string
    to: string
    subject: string
    message: string
}

export type QRCode = {
    imageData: string
    targetURL: string
}

// TicketCounter defines an object that keeps count of the number of tickets available, reserved and sold.
export type TicketCounter = {
    _id: string
    available: number
    reserved: number
    sold: number
}

export type User = {
    _id: string
    roles: string[]
}

// TODO: cleanly separate the concept of a user (in the db) from the concept of a user (in the session)
export type SessionUser = {
    _id: string,
    userName: string,
    isASuperUser: boolean,
    wasFound: boolean,
}