<script lang="ts">
    import type {ServerData} from "./+page.server";

    export let data: ServerData
</script>


<main class="container">

    <article>
        <h1>{data.ticketCounter._id} Details</h1>

        <br>
        ticket type: <b>{data.ticketCounter._id}</b><br>
        <ul>
            <li>Available: {data.ticketCounter.available} </li>
            <li>Reserved: {data.ticketCounter.reserved} </li>
            <li>Sold: {data.ticketCounter.sold} </li>
        </ul>
        <form action="?/incrementAvailableCount" method="POST">
            <input type="submit" value="add 10 to available">
        </form>

    </article>

    <a href="/api">admin home</a>

</main>

