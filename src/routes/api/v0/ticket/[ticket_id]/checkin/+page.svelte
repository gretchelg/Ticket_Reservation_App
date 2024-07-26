<script lang="ts">
    import type {ServerData} from "./+page.server";
    import {BookingPaymentStatus, TicketCanCheckIn, TicketCanCheckOut, TicketStatus} from "$lib/entities/values";

    // data is the object received from the server
    export let data: ServerData

    // const isPaid = data.aBooking.payment_status === BookingPaymentStatus.PAID
    // const isCheckedIn = data.aTicket.status === TicketStatus.CHECKED_IN
    // const canCheckIn = isPaid && !isCheckedIn
    const canDoCheckIn = TicketCanCheckIn(data.aBooking, data.aTicket)
    // const canDoCheckOut = isPaid && isCheckedIn
    const canDoCheckOut = TicketCanCheckOut(data.aBooking, data.aTicket)
</script>

<main class="container">
    {#if data.aTicket}
    <article>
        <h1>Ticket Check-In</h1>
        ticket_id: <a href="details">{data.aTicket.ticket_id}</a> <br>
        booking_reference_no: <a href="/api/v0/booking/{data.aTicket.booking_reference_no}/details">{data.aTicket.booking_reference_no}</a><br>
        name: {data.aTicket.name} <br>
        ticket_type: {data.aTicket.ticket_type} <br>
        status: {data.aTicket.status} <br>
        <!--        description: {data.aTicket.description} <br>-->

<!--        <h2>Checkin QR Code</h2>-->
<!--        <div>-->
<!--            <img src="{data.checkin.imageData}" alt="QR Code"/>-->
<!--        </div>-->

<!--        <p>QR code target: <strong>{data.checkin.targetURL}</strong></p>-->

        <br>

        <form action="?/checkIn" method="POST">
            <button type="submit" disabled={!canDoCheckIn}>Check-In</button>
        </form>

        <form action="?/checkOut" method="POST">
            <button type="submit" disabled={!canDoCheckOut}>Check-Out</button>
            DEBUG only, to test check-in/out process
        </form>

        <br>
        <br>
        <a href="/api/v0/ticket/list">list tickets</a>

    </article>
    {/if}

    <a href="/api">admin home</a>
</main>

