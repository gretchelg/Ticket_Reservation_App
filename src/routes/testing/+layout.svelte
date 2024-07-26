<script lang="ts">
    import '@picocss/pico'

    import { signIn, signOut } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
</script>



<nav class="container-fluid">
    <ul>
        <li style="color: white;"><a href="/testing">Testing Pages</a></li>
    </ul>
    <ul>
        {#if $page.data.session?.user}
            <li><a style="color: white;">{$page.data.session.user.email}</a></li>
            <li><a href="/signin" role="button" on:click={signOut}>Sign out</a></li>
        {:else}
            <li><button on:click={()=>signIn('google')}>Sign in</button></li>
        {/if}
    </ul>
</nav>

<slot />