<script lang="ts">
    import { Carousel, CarouselControl, CarouselIndicators, CarouselItem } from '@sveltestrap/sveltestrap';
    // const items = [
    //     "https://res.cloudinary.com/dg2u7fmoc/image/upload/v1720674851/1600x900_KGF-Poster04_1_2_yisit6.png",
    //     "https://res.cloudinary.com/dg2u7fmoc/image/upload/v1720675049/1600x900_KGF-Poster04_1_cutylw.png",
    //     "https://res.cloudinary.com/dg2u7fmoc/image/upload/v1721146397/hero3_vdhpiv.png",
    // ];
    const items = [
        "poster1.png",
        "poster2.png",
        "Message.png",
    ];
    let activeIndex = 0;  

</script>

<style>
    .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Ensures the footer is at the bottom */
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

    .video-container {
        margin: 20px 0; /* Add some margin for spacing */
        background-color: #1b2c2d; /* Primary blue */
        border-radius: 6px; /* Rounded corners */
    }

    video {
        width: 100%; /* Make the video responsive */
        height: 60vh;
        object-fit: center;
    }
</style>

<main class="container-fluid wrapper">
        <Carousel {items} bind:activeIndex>
            <CarouselIndicators bind:activeIndex {items} />
            <div class="carousel-inner">
                {#each items as item, index}
                <CarouselItem bind:activeIndex itemIndex={index}>
                    <img src={item} class="d-block w-100" alt="{item} {index + 1}" />
                </CarouselItem>
                {/each}
            </div>
        </Carousel>

        <div class="video-container">
            <!-- svelte-ignore a11y-media-has-caption -->
            <!-- <video controls>
                <source src="/AdBo.mov" type="video/mp4">
            </video> -->
            
            <!-- svelte-ignore a11y-media-has-caption -->
            <video controls>
                <source src="https://res.cloudinary.com/dg2u7fmoc/video/upload/v1721200925/Ad_Bo_-_HD_720p_yqzxwj.mov" type="video/mp4">
            </video>
        </div>
    
    <article>
        <h3>UPCOMING EVENTS</h3>
        <ul>
            <li>
                <h3>
                    The Grand Feast Europe and UK 2024
                </h3>
                <ul>
                    <li>
                        9:00 AM to 12:00 PM
                    </li>
                    <li>
                        September 22, 2024
                    </li>
                    <li>
                        <a href="https://www.nh-hotels.com/en/hotel/nhow-brussels-bloom">
                            <b>Hotel nhow Brussels Bloom:</b>
                        </a> 
                        Rue Royale - Koningsstraat 250 1210 Brussels Belgium
                    </li>
                </ul>
            </li>
            <br>

            <h4>Ticket Types</h4>
            <ul>
                <li>Standard - <span><del>35 € </del> 30 € (Early bird discount - Ends July 27, 2024)</span></li>
                <li>VIP - 55 € <span>(Limited to 40 seats only)</span></li>
                    <b>VIP ticket perks:</b>
                    <ul>
                        <li>Premium seating area.</li>
                        <li>One Bo Sanchez book.</li>
                        <li>Priority access to the book signing.</li>
                        <li>Meet-and-greet and photo opportunity with Bo Sanchez.</li>
                    </ul>
                <li>Youth (12 to 17 years old) - 17 €</li>
                <li>Child (Under 12 years old) - FREE ADMISSION (when accompanied by a paying adult)</li>
                

            </ul>
        </ul>
        <div>
            <a href="/newbooking" class="book-now-button">
                RESERVE YOUR TICKETS NOW
            </a>  
        </div>  
    </article>

</main>
