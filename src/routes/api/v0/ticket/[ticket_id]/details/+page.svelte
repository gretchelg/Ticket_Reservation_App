<script lang="ts">
    import type {ServerData} from "./+page.server";

    // data is the object received from the server
    export let data: ServerData


</script>

<main class="container">
    {#if data.aTicket}
    <article>
        <h1>Ticket Details</h1>
        ticket_id: {data.aTicket.ticket_id} <br>
        booking_reference_no: <a href="/api/v0/booking/{data.aTicket.booking_reference_no}/details">{data.aTicket.booking_reference_no}</a> <br>
        name: {data.aTicket.name} <br>
        ticket_type: {data.aTicket.ticket_type} <br>
        status: {data.aTicket.status} <br>
<!--        description: {data.aTicket.description} <br>-->
        <br>

        <h2>Checkin QR Code</h2>
        <div>
            <img src="{data.checkin.imageData}" alt="QR Code"/>
        </div>

        <p>QR code target: <strong>{data.checkin.targetURL}</strong></p>

<!--        <form action="./checkin" method="GET">-->
<!--            <input type="submit" value="Check In"/>-->
<!--        </form>-->
        <a href="./checkin">View Check-In</a>


        <br>
        <br>
        <a href="/api/v0/ticket/list">list tickets</a>

    </article>
    {/if}

    <a href="/api">admin home</a>
</main>

