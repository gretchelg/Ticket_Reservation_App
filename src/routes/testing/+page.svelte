<script>
    import { writable } from "svelte/store";
    import { store } from "$lib/store";

    let counter = writable(0)

    let shadowUser
    $: shadowUser = $store.user

    function updateUser() {
        store.update(v => {
            v.user = "John Doe"
            return v
        })
    }
</script>


<main class="container">
    <hgroup>
        <h2>Welcome to Grand Feast UKxE 2024</h2>
        <h3>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</h3>
    </hgroup>

    <article>
        <p>Routes</p>
        <ul>
            <li>
                <a href="/testing/about">/testing/about</a>
            </li>
            <li>
                <a href="/testing/boat">/testing/boat</a>
            </li>
            <li>
                <a href="/testing/emailsender">/testing/emailsender</a>
            </li>
            <li>
                <a href="/testing/hello">/testing/hello</a>
            </li>
            <li>
                <a href="/testing/qrcodegenerator">/testing/qr code generator</a>
            </li>
        </ul>
    </article>

    <article>
        <p>Counter: {$counter}</p>
         <a href="#" role="button" on:click={() => {counter.update(v => v+1)}}>Add</a>
    </article>

    <article>
        <h3>Testing Stores' Reactivity</h3>
        <p>User is: { $store.user }</p>
        <p>Shadow User is: { shadowUser }</p>
        <a href="#" role="button" on:click={updateUser}>Update User</a>
    </article>
</main>
