<script lang="ts">
    import type {ServerData} from "./+page.server";

    export let data: ServerData
</script>


<main class="container">
    <!-- PAGE TITLE -->
    <article>
        <hgroup>
            <h1>Admin Home</h1>
            <h2>Welcome to the app admin homepage</h2>
        </hgroup>
    </article>

    <!-- BOOKINGS + TICKETS -->
    <article>
        Bookings
        <ul>
            <li>
                <a href="/api/v0/booking/list">List</a>
            </li>
            <li>
                <a href="/api/v0/booking/search">Search</a>
            </li>
            <li>
                <a href="/newbooking">Create</a>
            </li>
        </ul>

        Tickets
        <ul>
            <li>
                <a href="/api/v0/ticket/list">List</a>
            </li>
        </ul>

    </article>

    <!-- TICKET COUNTERS -->
    <article>
        Standard Tickets
        <ul>
            <li>{data.standardTicketCounter.available} available |
                {data.standardTicketCounter.reserved} reserved |
                {data.standardTicketCounter.sold} sold | <a href="/api/v0/ticket_counter/standard_tickets/details">update</a>
            </li>
        </ul>

        VIP Tickets<br>
        <ul>
            <li>{data.vipTicketCounter.available} available |
                {data.vipTicketCounter.reserved} reserved |
                {data.vipTicketCounter.sold} sold | <a href="/api/v0/ticket_counter/vip_tickets/details">update</a>
            </li>
        </ul>

        Youth Tickets<br>
        <ul>
            <li>{data.youthTicketCounter.available} available |
                {data.youthTicketCounter.reserved} reserved |
                {data.youthTicketCounter.sold} sold | <a href="/api/v0/ticket_counter/youth_tickets/details">update</a>
            </li>
        </ul>

    </article>


    <!-- OTHERS -->
    <article>
        Others
        <ul>
            <li><a href="/testing/emailsender">Send an email</a></li>
        </ul>

    </article>

</main>

