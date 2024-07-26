<script lang="ts">
    // data is the object received from the server
    export let data

    // myURL is stores user input URL for (1) display and (2) sending to the server for generating QR code
    let myUrl = ""

    // useExample sets some example URL if the user doesn't want to input a URL
    function useExample() {
        myUrl = 'https://www.eurogamer.net/armored-core-6-fires-of-rubicon-review#:~:text=AC6%20doesn\'t%20need%20Soulslike,re%20pure%20Mobile%20Suit%20Gundam.'; // Eurogamer aAC6 review
    }
</script>

<main class="container">
    <hgroup>
        <h1>QR Code Generator</h1>
        <h2>generate a QR code</h2>
    </hgroup>


    <article>
        <p>Enter a url:</p>

        <input type="text" name="urlInput" bind:value={myUrl}>
        <a on:click={useExample} >(or use an example)</a>

        <a href="/testing/qrcodegenerator?xurl={myUrl}">
            <button>generate QR code</button>
        </a>

        <!--        don't render the QR code img element if there is no QR code (like on first page load) -->
        {#if data.qrCodeImage}
            <div>
                <img src="{data.qrCodeImage}" alt="QR Code"/>
            </div>

            <footer>
                <p>above QR code targets url: <strong>{data.targetUrl}</strong></p>
                <p>try scanning with your phone camera!</p>
            </footer>
        {/if}

    </article>

    <a href="/">home</a>
</main>

