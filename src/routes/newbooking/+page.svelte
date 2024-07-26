<script lang="ts">
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { Alert } from '@sveltestrap/sveltestrap';
    import type { ServerData } from './+page.server';

    export let data: ServerData;
    const colors = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
    ];

    const standardTicketCounter = data.standardTicketCounter;
    const vipTicketCounter = data.vipTicketCounter;
    const youthTicketCounter = data.youthTicketCounter;

    let canReserve = true;

    let ticketAvailabilityMessage = '';
    let quantityMessage = '';
    let emailValidationMessage = ''; // Variable to hold the email validation message

    // Define a Ticket type for demonstration purposes
    interface Ticket {
        ticket_id: number;
        name: string;
        ticket_type: string;
        description: string;
    }

    // Reactive variables for form handling
    let ticketType: string = ''; // No default value selected initially
    let quantity: number = 0; // Default to 0
    let totalAmount: number = calculateTotal(ticketType, quantity);
    let email: string = ''; // Variable to store email input
    let guests: string[] = []; // Array to store guest names

    function calculateTotal(ticketType: string, quantity: number): number {
        let ticketPrice = 0; // Default price

        // Determine the ticket price based on the ticket type
        switch (ticketType) {
            case 'standard':
                ticketPrice = 30;
                break;
            case 'vip':
                ticketPrice = 55;
                break;
            case 'youth':
                ticketPrice = 17;
                break;
            default:
                ticketPrice = 0; // Default to 0 if no valid type is selected
        }

        // Return the total amount
        return ticketPrice * quantity;
    }

    // Function to update total amount when ticketType or quantity changes
    function updateTotal(): void {
        // Calculate the remaining tickets if reservation was successful
        let availableTickets = 0;
        switch (ticketType) {
            case 'standard':
                availableTickets = standardTicketCounter.available;
                break;
            case 'vip':
                availableTickets = vipTicketCounter.available;
                break;
            case 'youth':
                availableTickets = youthTicketCounter.available;
                break;
            default:
                availableTickets = 0; // Handle unexpected cases
        }
        const remainingTicketsAfterBooking = availableTickets - quantity;

        ticketAvailabilityMessage = '';
        quantityMessage = '';
        canReserve = true;

        // Prevent booking that will make the available tickets negative
        if (remainingTicketsAfterBooking < 0) {
            canReserve = false;
            ticketAvailabilityMessage = `*** Only ${availableTickets} ${ticketType} tickets available ***`;
        } else if (quantity < 1) {
            canReserve = false;
            quantityMessage = `Please select the number of tickets you would like to reserve.`;
        } else {
            canReserve = true;
        }

        totalAmount = calculateTotal(ticketType, quantity);
        // Ensure guests array matches quantity
        if (quantity > guests.length) {
            guests = Array(quantity)
                .fill('')
                .map((_, index) => guests[index] || '');
        } else if (quantity < guests.length) {
            guests = guests.slice(0, quantity);
        }
    }

    // Function to validate email format
    function validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    let isValidEmail = false;
    function doValidateEmail(): void {
        isValidEmail = validateEmail(email);
        emailValidationMessage = isValidEmail ? '' : 'Please enter a valid email address.';
    }

    // Create an event dispatcher to send the total amount to parent components if needed
    const dispatch = createEventDispatcher();

    onMount(() => {
        // Initial calculation
        updateTotal();
    });

    // Watch for changes in ticketType and quantity to update total
    $: updateTotal();
</script>

<style>
    .grid {
        display: flex;
        flex-direction: column;
    }

    .grid > div,
    .grid > label,
    .grid > input,
    .grid > select,
    .grid > button {
        margin-bottom: 1rem; /* Adds space between fields */
    }

    .total-amount {
        display: flex;
        align-items: center;
        color: darkblue;
        font-weight: 900;
    }

    .total-amount label {
        margin-right: 1rem;
        font-weight: 900;
    }

    .guest-fields {
        margin-top: 1rem;
    }

    .guest-fields > div {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .guest-fields label {
        margin-right: 1rem;
    }

    .warning {
        color: red; /* Set font color to white */
        text-align: center; /* Optional: Center the text */
    }

    /* Style for the hgroup */
    hgroup h1 {
        color: white; /* Set font color to white */
        text-align: center; /* Optional: Center the text */
    }

    hgroup h2,
    h4 {
        color: #fae6c8; /* Set font color to white */
        text-align: center; /* Optional: Center the text */
    }
    hgroup h1,
    hgroup h2,
    hgroup h4 {
        margin: 0; /* Optional: Remove default margin */
    }

    .book-now-button {
        background-color: #1b2c2d; /* Primary blue */
        color: white; /* Text color */
        padding: 10px 20px; /* Padding */
        text-decoration: none; /* Remove underline */
        display: inline-block; /* Make it a block element */
        border-radius: 4px; /* Rounded corners */
    }

    .book-now-button:hover {
        background-color: #083c40; /* Darker blue on hover */
        color: #fae6c8; /* Keep text white on hover */
    }
</style>

<main class="container">
    <hgroup>
        <br />
        <h1>BOOK YOUR TICKETS NOW!</h1>
        <br />
        <h2>The Grand Feast Europe and UK 2024</h2>
        <h4>nhow Brussels Bloom - September 22, 2024 (starts at 9:00AM)</h4>
    </hgroup>

    <article>
        <!-- Remove the handleSubmit function from form submission -->
        <form method="POST">
            <div class="grid">
                <label for="name">Name*:</label>
                <input type="text" id="name" name="name" placeholder="First and Surname" required />

                <div class="mb-3">
                    <label for="email">Email address*:</label>
                    <input
                        type="email"
                        class="form-control"
                        id="email"
                        name="email"
                        placeholder="name@gmail.com"
                        bind:value={email}
                        on:input={doValidateEmail} 
                        required
                    />
                    {#if emailValidationMessage}
                        <Alert color="danger">{emailValidationMessage}</Alert>
                    {/if}
                </div>

                <label for="city">Are you attending or serving in a Feast? If yes, which city?</label>
                <input type="text" id="city" name="city" placeholder="Indicate the city name" required />

                <label for="ticket_type">Ticket Type*:</label>
                <select
                    id="ticket_type"
                    bind:value={ticketType}
                    name="ticket_type"
                    on:change={updateTotal}
                    required
                >
                    <option value="">Select Ticket Type</option>
                    <!-- No default selected option -->
                    <option value="standard">Standard - 30€</option>
                    <option value="vip">VIP - 55€</option>
                    <option value="youth">Youth (12 to 17 years) - 17€</option>
                </select>

                <label for="quantity">Quantity*:</label>
                {#if ticketAvailabilityMessage !== ''}
                    <Alert color="danger">{ticketAvailabilityMessage}</Alert>
                {/if}

                {#if quantity < 1}
                    <Alert color="warning">{quantityMessage}</Alert>
                {/if}

                <select
                    id="quantity"
                    bind:value={quantity}
                    name="quantity"
                    on:change={updateTotal}
                    required
                >
                    <!-- Create dropdown options from 0 to 10 -->
                    {#each Array(11).fill(0).map((_, i) => i) as number}
                        <option value={number}>{number}</option>
                    {/each}
                </select>

                {#if quantity > 0}
                    <div class="guest-fields">
                        {#each guests as guest, index}
                            <div>
                                <label for="guest_{index + 1}">Guest {index + 1}:</label>
                                <input
                                    type="text"
                                    name="guest_{index + 1}"
                                    bind:value={guests[index]}
                                    placeholder="Guest {index + 1} - Full Name"
                                    required
                                />
                            </div>
                        {/each}
                    </div>
                {/if}

                <p>Payment Method: Bank Transfer</p>

                <div class="total-amount" aria-labelledby="total-amount-label">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label id="total-amount-label">Total Amount Payable:</label>
                    <span>{totalAmount}€</span>
                </div>

                <!-- Update disabled condition to include email validation -->
                <button class="book-now-button" type="submit" disabled={!canReserve || !isValidEmail}>
                    RESERVE NOW
                </button>
                <p class="warning">*** Tickets sold are non-refundable ***</p>
            </div>
        </form>
        <a href="/">back to home</a>
    </article>
</main>