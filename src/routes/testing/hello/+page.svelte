<script lang="ts">
    // import type { PageData } from './$types'

    // export let data: PageData
    export let data
</script>

<main class="container">
    <hgroup>
        <h1>Hello, World!</h1>
        <h2>your basic hello world page</h2>
    </hgroup>


    <article>
        Hello, <strong>{data.text}</strong>!
        <footer>
        note: data fetched from server
        </footer>

    </article>

    <a href="/">home</a>
</main>

