import type { Email, Booking } from "$lib/entities/models";
import * as emailService from "$lib/server/external_services/email";
import * as bookingWorkflows from "$lib/server/workflows/bookings";
import {error} from "@sveltejs/kit";
import {QRCode, Ticket} from "$lib/entities/models";

// Send an email
export async function Send(email: Email): Promise<void> {
    // TODO maybe add validation here

    try {
        await emailService.Send(email)
    } catch (e) {
        console.error(`[ERROR] failed sending email to ${email.to}. Resp body:`, e)
        throw e
    }

    return
}

export async function SendTicketsEmail(booking_reference_no: string): Promise<void> {
    // get booking
    const aBooking: Booking | null = await bookingWorkflows.GetByID(booking_reference_no)

    if (!aBooking){
        throw error(404, "booking not found")
    }

    // get tickets
    const tickets: Ticket[] = await bookingWorkflows.GetRelatedTickets(booking_reference_no)

    // send email
    const booking: Booking = aBooking


    const email: Email = {
        from: "",
        to: booking.email,
        subject: "Your Tickets " + booking.reference_no,
        message: `
        <html>
            <style>
                        body {
                            font-family: "Tahoma", sans-serif;
                            line-height: 1.6;
                        }
                        h1, h2 {
                            color: #333;
                            font-family: "Tahoma", sans-serif;
                        }
                        p {
                            margin: 0.5em 0;
                            font-family: "Tahoma", sans-serif;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                            margin-left: 20px; /* Indent the list */
                        }
                        ul li {
                            margin: 0.5em 0;
                            font-family: "Tahoma", sans-serif;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #000;
                            font-family: "Tahoma", sans-serif;
                        }
                        .container {
                            background-color: #f7f5ed;
                            padding: 20px;
                            max-width: 650px;
                            margin: 0 auto;
                        }
                        .image img {
                            display: block;
                            width: 100%;
                            user-select: none;
                            pointer-events: none;
                            -webkit-user-drag: none;
                        }
                    </style>
                </head>
                <body style="padding: 0; margin: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="left">
                                <div class="container" style="background-color: #f7f5ed; font-family: "Tahoma", sans-serif;">
                                    <h2>Dear ${booking.name},</h2>
                                    <p>
                                        Here are your eTickets for the Grand Feast Europe and UK 2024. 
                                        Please remember to bring your e-ticket with the QR code, as you'll need it for entry at the venue. 
                                        Having your e-ticket ready for scanning will make check-in quick and easy.
                                    </p>
                                    <br>
                                
                                    <hr>
                                    <!-- TICKETS + QR CODE SECTION -->
                                    ${
                                        tickets.map((ticket, i) => `
                                            <div>
                                                <h2>${i+1}: eTicket ${ticket.ticket_id}</h2>
                                                Name: ${ticket.name}<br>
                                                Ticket Class: ${ticket.ticket_type}<br>
                                                Checkin QR Code <br>
                                                <div>
                                                    <img src="${ticket.checkin_qr_code_image_url}" alt="QR Code"/>
                                                </div>
                                            </div>
                                            <hr>
                                        `).join("")
                                    }
                                    
                                    <h2>Booking Summary</h2>
                                    <h3>Booking reference number: ${booking.reference_no}</h3>
                                    <br>

                                    <!-- BOOKING DETAILS SECTION -->
                                    ${booking.ticket_ids.length} ${booking.ticket_type} tickets, ${booking.amount_total} EUR, ${booking.payment_status} <br>

                                    ${booking.guests.length} guests: <br>
                                    <ol>
                                        ${ booking.guests.map(guest => `
                                            <li>
                                                ${guest}
                                            </li>`)
                                            .join("")
                                        }
                                    </ol>

                                    Event Details: <br>
                                    <ul>
                                        <li>The Grand Feast Europe and UK 2024</li>
                                        <li>Date: September 22, 2024</li>
                                        <li>Time: 9:00 AM to 12:00 PM CET</li>
                                        <li>Venue: Hotel nhow Brussels Bloom: Rue Royale</li>
                                        <li>Address: Koningsstraat 250 1210 Brussels Belgium</li>
                                    </ul>


                                    <!-- PARTING MESSAGE -->
                                    We hope you have a great time at the event! <br>
                                    <br>

                                    Have a blessed day! <br>
                                    The Feast Europe and UK Team <br>
                                    <br>

                                    <hr>
                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
        </html>
        `
    };

    await Send(email)
}

export async function SendPaymentReminder(booking_reference_no: string): Promise<void> {
    // retrieve booking
    const aBooking: Booking | null = await bookingWorkflows.GetByID(booking_reference_no)

    if (!aBooking){
        throw error(404, "booking not found")
    }

    const booking = aBooking

    // send the email
    const email: Email = {
        from: "",
        to: booking.email,
        subject: "Gentle Reminder: Your Ticket Reservation " + booking.reference_no + " is Waiting",
        message: `
        <html>
                <head>
                    <style>
                        body {
                            font-family: "Tahoma", sans-serif;
                            line-height: 1.6;
                        }
                        h1, h2 {
                            color: #333;
                            font-family: "Tahoma", sans-serif;
                        }
                        p {
                            margin: 0.5em 0;
                            font-family: "Tahoma", sans-serif;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                            margin-left: 20px; /* Indent the list */
                        }
                        ul li {
                            margin: 0.5em 0;
                            font-family: "Tahoma", sans-serif;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #000;
                            font-family: "Tahoma", sans-serif;
                        }
                        .container {
                            background-color: #f7f5ed;
                            padding: 20px;
                            max-width: 650px;
                            margin: 0 auto;
                        }
                        .image img {
                            display: block;
                            width: 100%;
                            user-select: none;
                            pointer-events: none;
                            -webkit-user-drag: none;
                        }
                    </style>
                </head>
                <body style="padding: 0; margin: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #b1c1c7;">
                        <tr>
                            <td align="left">
                                <div class="container">
                                
                                    <h1>Hello ${booking.name},</h1>
                                    <h2>Greetings from The Feast Europe and UK!</h2>

                                    <p>
                                        A gentle reminder that your ticket reservation is awaiting payment.
                                        If you have already done so, kindly ignore this email.
                                    </p>
                                    
                                    <br>
                                    <p>
                                        In this email you will find the instructions on how to pay for your ticket reservation. 
                                        Please transfer your payment to the following account within <span class="highlight">24H</span>, 
                                        stating the purpose <span class="highlight">${booking.reference_no}</span>.
                                    </p>
                                    
                                    <br>
                                    <ul>
                                        <li>Recipient: <span class="highlight">THE FEAST BRUSSELS (LIGHT OF JESUS FAMILY)</span></li>
                                        <li>Bank Details: <span class="highlight">BE53001757936353</span></li>
                                        <li>BIC: <span class="highlight">GEBABEBB</span></li>
                                        <li>Bank Name: <span class="highlight">BNP PARIBAS FORTIS</span></li>
                                        <li>Purpose: <span class="highlight">${booking.reference_no}</span></li>
                                        <li>Payable Amount: <span class="highlight">${booking.amount_total} €</span> (EURO)</li>
                                    </ul>
                                    <br>
                                    
                                    <p>
                                        Remember to indicate the unique booking reference number: <span class="highlight">${booking.reference_no}</span> 
                                        as purpose so that we can allocate your payment.
                                        We want to inform you that it may take up to <span class="highlight">48H</span> 
                                        to verify your payment.
                                        Once payment has been verified, you will receive your eTickets.
                                    </p>
                                    <br>

                                    <p>
                                        If you need help with your booking, please contact us at 
                                        <span class="highlight">support@grandfeast.eu</span>
                                    </p> 
                                    <br>
                                    <p>
                                        Thank you for your booking, and we are excited to see you at The Grand Feast in Brussels.
                                    </p>
                                    <br>
                                    <br>
                                    <p>Best regards,</p>
                                    <p><span class="highlight">The Feast Europe and UK Team</span></p>

                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        `
    };

    await Send(email)
}


export async function SendBookingConfirmation(booking: Booking): Promise<void> {
    const email: Email = {
        from: "",
        to: booking.email,
        subject: "Your Ticket Reservation " + booking.reference_no,
        message: `
        <html>
                <head>
                    <style>
                        body {
                            font-family: "Tahoma", sans-serif;
                            line-height: 1.6;
                        }
                        h1, h2 {
                            color: #333;
                            font-family: "Tahoma", sans-serif;
                        }
                        p {
                            margin: 0.5em 0;
                            font-family: "Tahoma", sans-serif;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                            margin-left: 20px; /* Indent the list */
                        }
                        ul li {
                            margin: 0.5em 0;
                            font-family: "Tahoma", sans-serif;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #000;
                            font-family: "Tahoma", sans-serif;
                        }
                        .container {
                            background-color: #f7f5ed;
                            padding: 20px;
                            max-width: 650px;
                            margin: 0 auto;
                        }
                        .image img {
                            display: block;
                            width: 100%;
                            user-select: none;
                            pointer-events: none;
                            -webkit-user-drag: none;
                        }
                    </style>
                </head>
                <body style="padding: 0; margin: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #b1c1c7;">
                        <tr>
                            <td align="left">
                                <div class="container">
                                
                                    <h1>Hello ${booking.name},</h1>
                                    <h2>Greetings from The Feast Europe and UK!</h2>

                                    <p>
                                        In this email you will find the instructions on how to pay for your ticket reservation. 
                                        Please transfer your payment to the following account within <span class="highlight">24H</span>, 
                                        stating the purpose <span class="highlight">${booking.reference_no}</span>.
                                    </p>
                                    
                                    <br>
                                    <ul>
                                        <li>Recipient: <span class="highlight">THE FEAST BRUSSELS (LIGHT OF JESUS FAMILY)</span></li>
                                        <li>Bank Details: <span class="highlight">BE53001757936353</span></li>
                                        <li>BIC: <span class="highlight">GEBABEBB</span></li>
                                        <li>Bank Name: <span class="highlight">BNP PARIBAS FORTIS</span></li>
                                        <li>Purpose: <span class="highlight">${booking.reference_no}</span></li>
                                        <li>Payable Amount: <span class="highlight">${booking.amount_total} €</span> (EURO)</li>
                                    </ul>
                                    <br>
                                    
                                    <p>
                                        Remember to indicate the unique booking reference number: <span class="highlight">${booking.reference_no}</span> 
                                        as purpose so that we can allocate your payment.
                                        We want to inform you that it may take up to <span class="highlight">48H</span> 
                                        to verify your payment.
                                        Once payment has been verified, you will receive your eTickets.
                                    </p>
                                    <br>

                                    <p>
                                        If you need help with your booking, please contact us at 
                                        <span class="highlight">support@grandfeast.eu</span>
                                    </p> 
                                    <br>
                                    <p>
                                        Thank you for your booking, and we are excited to see you at The Grand Feast in Brussels.
                                    </p>
                                    <br>
                                    <br>
                                    <p>Best regards,</p>
                                    <p><span class="highlight">The Feast Europe and UK Team</span></p>

                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        `
    };

    await Send(email)
}

// SendTicketsEmail_Backup is a backup of the old SendTicketsEmail function.
// It uses embedded QRCode image in the email HTML body
// export async function SendTicketsEmail_Backup(booking_reference_no: string): Promise<void> {
//     // get booking
//     const aBooking: Booking | null = await bookingWorkflows.GetByID(booking_reference_no)
//
//     if (!aBooking){
//         throw error(404, "booking not found")
//     }
//
//     // get tickets + their QR Codes
//     const ticketsDataX: {ticket: Ticket, qrCodeData: QRCode}[]  = await bookingWorkflows.GetRelatedTicketsWithCheckinQRCode(booking_reference_no)
//
//     // send email
//     // const tickets = ticketsData.map(td => td.ticket)
//
//     const booking = aBooking
//     const ticketsData = ticketsDataX
//
//
//     const email: Email = {
//         from: "",
//         to: aBooking.email,
//         subject: "Your Tickets " + aBooking.reference_no,
//         message: `
//         <html>
//             <style>
//                         body {
//                             font-family: "Tahoma", sans-serif;
//                             line-height: 1.6;
//                         }
//                         h1, h2 {
//                             color: #333;
//                             font-family: "Tahoma", sans-serif;
//                         }
//                         p {
//                             margin: 0.5em 0;
//                             font-family: "Tahoma", sans-serif;
//                         }
//                         ul {
//                             list-style-type: none;
//                             padding: 0;
//                             margin-left: 20px; /* Indent the list */
//                         }
//                         ul li {
//                             margin: 0.5em 0;
//                             font-family: "Tahoma", sans-serif;
//                         }
//                         .highlight {
//                             font-weight: bold;
//                             color: #000;
//                             font-family: "Tahoma", sans-serif;
//                         }
//                         .container {
//                             background-color: #f7f5ed;
//                             padding: 20px;
//                             max-width: 650px;
//                             margin: 0 auto;
//                         }
//                         .image img {
//                             display: block;
//                             width: 100%;
//                             user-select: none;
//                             pointer-events: none;
//                             -webkit-user-drag: none;
//                         }
//                     </style>
//                 </head>
//                 <body style="padding: 0; margin: 0;">
//                     <table width="100%" cellpadding="0" cellspacing="0" border="0">
//                         <tr>
//                             <td align="left">
//                                 <div class="container" style="background-color: #f7f5ed; font-family: "Tahoma", sans-serif;">
//                                     <h1>Booking: ${booking.reference_no}</h1>
//                                     <hr>
//                                     <!-- TICKETS + QR CODE SECTION -->
//                                     ${
//             ticketsData.map((ticketData, i) => `
//                                             <div>
//                                                 <h2>${i+1}: Ticket ${ticketData.ticket.ticket_id}</h2>
//                                                 Name: ${ticketData.ticket.name}<br>
//                                                 Ticket Class: ${ticketData.ticket.ticket_type}<br>
//                                                 Checkin QR Code <br>
//                                                 <div>
//                                                     <img src="${ticketData.qrCodeData.imageData}" alt="QR Code"/>
//                                                 </div>
//                                             </div>
//                                             <hr>
//                                         `).join("")
//         }
//
//                                     <h2>Booking Summary</h2>
//                                     ${booking.name} <br>
//                                     <br>
//
//                                     <!-- BOOKING DETAILS SECTION -->
//                                     ${booking.ticket_ids.length} ${booking.ticket_type} tickets, ${booking.amount_total} EUR, ${booking.payment_status} <br>
//
//                                     ${booking.guests.length} guests: <br>
//                                     <ol>
//                                         ${ booking.guests.map(guest => `
//                                             <li>
//                                                 ${guest}
//                                             </li>`)
//             .join("")
//         }
//                                     </ol>
//
//                                     Event Details: <br>
//                                     <ul>
//                                         <li>The Grand Feast Europe and UK 2024</li>
//                                         <li>Date: September 22, 2024</li>
//                                         <li>Time: 9:00 AM to 12:00 PM CET</li>
//                                         <li>Venue: Hotel nhow Brussels Bloom: Rue Royale</li>
//                                         <li>Address: Koningsstraat 250 1210 Brussels Belgium</li>
//                                     </ul>
//
//
//                                     <!-- PARTING MESSAGE -->
//                                     We hope you have a great time at the event! <br>
//                                     <br>
//
//                                     Have a blessed day! <br>
//                                     The Feast Europe and UK Team <br>
//                                     <br>
//
//                                     <hr>
//                                 </div>
//                             </td>
//                         </tr>
//                     </table>
//                 </body>
//         </html>
//         `
//     };
//
//     await Send(email)
// }