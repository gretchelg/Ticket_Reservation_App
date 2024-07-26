<script lang="ts">
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { page } from "$app/stores"

</script>


<main class="container">
    <article>
        <h1>Log In</h1>

        <div>
            {#if $page.data.session?.user}
                <p>Signed in as {$page.data.session.user.email}</p>
                <button on:click={signOut}>Sign out</button>
                <br>
                <a href="/api">App Admin Page</a>
            {:else}
                <p>Not signed in</p>
                <button on:click={()=>signIn('google')}>Sign in</button>
            {/if}
        </div>
    </article>


</main>

