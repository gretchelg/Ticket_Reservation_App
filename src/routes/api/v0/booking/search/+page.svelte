<script lang="ts">
    export let data

    let searchValue: string
    console.log("[INFO] UI received data:", data)
</script>

<style>
    .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Ensures the footer is at the bottom */
    }

    .search-button {
        background-color: #1b2c2d; /* Primary blue */
        color: white; /* Text color */
        padding: 10px 20px; /* Padding */
        text-decoration: none; /* Remove underline */
        display: inline-block; /* Make it a block element */
        border-radius: 4px; /* Rounded corners */
    }

    .search-button:hover {
        background-color: #083c40; /* Darker blue on hover */
        color: #fae6c8; /* Keep text white on hover */
    }
</style>

<main class="container wrapper">
    <article>
        <h1>Search Booking Reference</h1>

        <div class="grid">
            <label for="referenceNo">Booking Reference Number:</label>
            <input type="text" id="referenceNo" placeholder="Enter booking reference number" bind:value={searchValue}>
            <a href="/api/v0/booking/search?reference_no={searchValue}">
                <button class="search-button">Search</button>
            </a>
            
        </div>
    </article>

    {#if data.noneFound }
    <article>
        Booking reference number not found.
    </article>
    {/if}


    {#if data.bookings.length > 0}
    <!-- <h2>Search Results</h2> -->

        {#each data.bookings as booking}
        <article>
            <h2>Search Results</h2>

            <div class="grid">
                <!-- <form action="?/markPaid" method="POST"> -->

                reference_no: {booking.reference_no}
                <br>
                name: {booking.name}
                <br>
                payment_status: {booking.payment_status}
                <!-- <form action="?/markPaid" method="POST">
                    <input name="reference_no" value={booking.reference_no} disabled>
                    <div class="grid">
                        <button type="submit">Mark Paid</button>
                    </div>
                </form> -->
        

                <a href="/api/v0/booking/{booking.reference_no}/details">
                    <button class="search-button">View Details</button>
                </a>
                
            </div>
        </article>
        {/each}
    {/if}


    <a href="/api">admin home</a>
</main>

