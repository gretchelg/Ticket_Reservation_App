<script lang="ts">
    import type {ServerData} from "./+page.server";

    export let data: ServerData
    // export let data

    console.log(data)
</script>


<main class="container">
    <article>
        <hgroup>
            <h1>System</h1>
            <h1>System Admins Only</h1>
        </hgroup>

        New Bookings Allowed: {data.newBookingsAllowed}
        <form action="?/toggleNewBookingsAllowed" method="POST">
            <input type="submit" value="toggle"/>
<!--            <a href="#" type="submit">toggle</a>-->
        </form>
        TODO: use value to halt new booking screen<br>
        <br>

<!--        <input type="checkbox" role="switch" bind:checked={data.newBookingsAllowed} on:change={() => console.log("updated")}/>-->
        <a href="/api">admin home</a>
    </article>
</main>

