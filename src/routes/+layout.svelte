<script lang="ts">
    import '@picocss/pico';
    import { onMount } from 'svelte';

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    onMount(() => {
        // Close the menu when clicking outside
        document.addEventListener('click', (event) => {
            const menu = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (menu && hamburger && !menu.contains(event.target) && !hamburger.contains(event.target)) {
                isMenuOpen = false;
            }
        });
    });
</script>

<style>
    @import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';

    .nav-background {
        background-image: url('https://res.cloudinary.com/dg2u7fmoc/image/upload/v1720674705/background_16x9_u1pqvn.png');
        background-size: cover;
        background-position: center;
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        position: relative;
    }

    .nav-links {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nav-links li {
        margin-right: 1rem;
    }

    .nav-links a {
        text-decoration: none;
        color: white;
    }

    .nav-links a:hover {
        color: #fae6c8;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        cursor: pointer;
    }

    .hamburger div {
        width: 25px;
        height: 3px;
        background-color: white;
        margin: 4px 0;
    }

    .close-button {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        color: white;
        cursor: pointer;
    }

    .navbar-brand img {
        width: 100%; /* Ensures the image fills the container */
        height: auto; /* Maintains aspect ratio */
    }

    .logo-container {
        width: 100px; /* Adjust the width as needed */
        height: auto;
    }

    @media (max-width: 768px) {
        .nav-links {
            display: none;
            flex-direction: column;
            width: 100%;
            background-color: rgba(51, 51, 51, 0.9);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            padding-top: 60px;
        }

        .nav-links.show {
            display: flex;
        }

        .hamburger {
            display: flex;
        }

        .close-button {
            display: block;
        }
    }
</style>

<nav class="nav-background">
    <div class="logo-container">
        <a href="/" class="navbar-brand">
            <img src="https://res.cloudinary.com/dg2u7fmoc/image/upload/v1720673450/NEW_Feast_EU_UK_Logo_oofbyk.png" alt="Logo">
        </a>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="hamburger" on:click={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <ul class={`nav-links ${isMenuOpen ? 'show' : ''}`}>
        <button class="close-button" on:click={closeMenu}>&times;</button>
        <li><a href="/" on:click={closeMenu}>Home</a></li>
        <!-- <li><a href="/api/v0/booking/search" on:click={closeMenu}>Who We Are</a></li> -->
        <li><a href="/newbooking" on:click={closeMenu}>Event Tickets</a></li>
        <li><a href="/api" on:click={closeMenu}>Organizers</a></li>
    </ul>
</nav>

<slot />

