<script lang="ts">
    import type {ServerData} from "./+page.server";

    export let data: ServerData

    const tickets = data?.tickets ? data.tickets : []
</script>

<main class="container">
    <article>
        <hgroup>
            <h1>Tickets List</h1>
            <h2>Count: {tickets.length}</h2>
        </hgroup>
    </article>


    {#each tickets as ticket, i}
    <article>
        [{i + 1}] ticket_id: <a href="/api/v0/ticket/{ticket.ticket_id}/details">{ticket.ticket_id}</a> <br>
        {ticket.name} | {ticket.ticket_type} | status: {ticket.status} <br>
        booking_reference_no:  <a href="/api/v0/booking/{ticket.booking_reference_no}/details">{ticket.booking_reference_no}</a>

    </article>
    {/each}

    <a href="/api">admin home</a>
</main>

