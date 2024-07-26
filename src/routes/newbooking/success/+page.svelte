<script lang="ts">
    import { Button, Card, Fade } from '@sveltestrap/sveltestrap'; 
</script>

<style>
    .help-button {
    display: flex;
    justify-content: center; /* Center the buttons horizontally */
    align-items: center;     /* Center the buttons vertically (if needed) */
    gap: 1rem;               /* Add space between the buttons */
    padding: 1rem;           /* Optional: add padding around the container */
    }
</style>

<main class="container-fluid main-background">
    <article>
        <hgroup>
            <h1>Successfully Booked</h1>
            <h2>Please check your email for payment instructions.</h2>
        </hgroup>
    
    
        <div class="help-button">
            <Button outline color="danger" id="toggler">
                Didn't get our email?
            </Button>


            <Button outline color="info" id="toggler2">
                Need help with your booking?
            </Button>
        </div>

            <Fade toggler="#toggler">
                <Card body>
                    Check your spam or junk folder.
                </Card>
            </Fade>

            <Fade toggler="#toggler2">
                <Card body>
                    Send us an email at support@grandfeast.eu
                </Card>
            </Fade>

        <a href="/newbooking">book another</a> |
        <a href="/">home</a>

    </article>
</main>