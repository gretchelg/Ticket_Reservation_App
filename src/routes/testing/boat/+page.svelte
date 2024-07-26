<script lang="ts">
    // import type { PageData } from './$types'
    // export let data: PageData
    export let data
</script>

<main class="container">
    <h1>Boat Page</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

    <h2>Current Boat Name: {data.boatName}</h2>

    <form method="POST">
        <div class="grid">
            <input type="text" name="boatName">
            <button type="submit">Update Boat Name</button>
        </div>
    </form>

    <a href="/">home</a>
</main>