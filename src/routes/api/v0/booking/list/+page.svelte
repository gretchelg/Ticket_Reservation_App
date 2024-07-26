<script lang="ts">
    import type { Booking } from "$lib/entities/models"
    import type {ServerData} from "./+page.server";

    export let data: ServerData

    const bookings = data?.bookings ? data.bookings : []
</script>

<main class="container">
    <article>
        <hgroup>
            <h1>Bookings List</h1>
            <h2>Count: {bookings.length}</h2>
        </hgroup>
    </article>

    {#each bookings as booking, i}
    <article>
        [{i+1}] reference_no: <a href="/api/v0/booking/{booking.reference_no}/details">{booking.reference_no}</a> -- ({booking.email})<br>
        {booking.guests.length} {booking.ticket_type} tickets | {booking.amount_total} EUR | {booking.payment_status} <br>

        ticket_ids: [
            {#each booking.ticket_ids as ticket_id}
                <a href="/api/v0/ticket/{ticket_id}/details">{ticket_id} </a> <sp/>
            {/each}]
    </article>
    {/each}

    <a href="/api">admin home</a>
</main>

