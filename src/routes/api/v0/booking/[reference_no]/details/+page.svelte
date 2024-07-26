<script lang="ts">
    import {BookingPaymentStatus} from "$lib/entities/values";
    import * as values from "$lib/entities/values";
    import type {Booking} from "$lib/entities/models";

    // data is the object received from the server
    export let data: {
        aRecord: Booking
    }

    const booking = data.aRecord

    // flags for enabling buttons
    const canMarkAsPaid = values.BookingCanBeMarkedAsPaid(booking)
    const canGenerateTickets = values.BookingCanGenerateTickets(booking)
    const canCancel = values.BookingCanBeCancelled(booking)

    const isPaid = booking.payment_status === BookingPaymentStatus.PAID
    const allTicketsGenerated = booking.ticket_ids.length >= booking.guests.length
    const canViewSummary = isPaid && allTicketsGenerated
    const canSendTicketsEmail = canViewSummary

    const isUnpaid = booking.payment_status === BookingPaymentStatus.UNPAID
    const canSendPaymentReminderEmail = isUnpaid
</script>

<main class="container">

    <article>
        <h1>Booking Details</h1>

        reference_no: {booking.reference_no} <br>
        name: {booking.name} -- ({booking.email}) <br>
        payment_status: {booking.payment_status} <br>
        amount_total: {booking.amount_total} <br>
        guests: {booking.guests} <br>
        ticket_ids: <br>
        <ul>
            {#each booking.ticket_ids as ticket_id}
                <li>
                    <a href="/api/v0/ticket/{ticket_id}/details">{ticket_id}</a>
                </li>
            {/each}
        </ul>

        <form action="?/markPaid" method="POST">
            <button type="submit" disabled={!canMarkAsPaid}>Mark Paid</button>
        </form>

        {#if canSendPaymentReminderEmail}
            <form action="?/sendPaymentReminderEmail" method="POST">
                <button>Send Payment Reminder Email</button>
            </form>
        {/if}

        {#if canGenerateTickets}
            <form action="?/generateTickets" method="POST">
                <button type="submit">Generate Tickets</button>
            </form>
        {/if}

        {#if canSendTicketsEmail}
            <form action="?/sendTicketsEmail" method="POST">
                <button>Email Tickets</button>
            </form>
        {/if}

        {#if canCancel}
            <form action="/api/v0/booking/{booking.reference_no}/cancel">
                <button>Cancel Reservation</button>
            </form>
        {/if}

        {#if canViewSummary}
            <a href="/api/v0/booking/{booking.reference_no}/summary">View Booking Summary</a><br>
            <br>
        {/if}

        <a href="/api/v0/booking/list">list bookings</a> |
        <a href="/api/v0/booking/search">search</a>

    </article>

    <a href="/api">admin home</a>
</main>

