
import {GenerateRelatedTickets} from "$lib/server/workflows/bookings";
// import * as dbCounters from "$lib/server/data_sources/counters";
import * as counterWorkflows from "$lib/server/workflows/ticket_counters";
import {Insert} from "$lib/server/data_sources/users";
import * as eventloggger from "$lib/server/external_services/eventlogger";

// import {UploadImage} from "$lib/server/external_services/cloudinaryService";
// import * as qrCodeGen from "$lib/server/utils/qrCodeGen";

class Rectangle {
    height: number
    width: number
    description: string
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
    getArea() {
        return this.height * this.width;
    }
}

type Stuff = {
    rectangles: Rectangle[]
    strings: string[]
    aRectangle: Rectangle
}


import { page } from "$app/stores"

// export async function load({}) {
export async function load({ locals }) {

    const myRect = new Rectangle(10, 20)
    myRect.description = "This is a rectangle"
    console.log("myRect:", myRect)
    console.log("myRect.getArea():", myRect.getArea())
    console.log("myRect.description:", myRect.description)

    const myStuff: Stuff = {
        rectangles: [myRect, new Rectangle(4,9)],
        strings: ["hello", "world"],
        aRectangle: myRect
    }

    console.log("myStuff:", myStuff)

    eventloggger.Log("BOOKING_RESERVATION_CREATED", "admin", {
            booking_id: "booking123",
            ticket_id: "ticket123",
        })

    // const myRect2 = new Rectangle{
    //     height: 10,
    //     width: 20,
    //     description: "This is a rectangle"
    // }

    // const qrCodeImage = await qrCodeGen.GenerateQRCodeImage("https://grandfeast.eu");
    // const cloudinaryResp = await UploadImage(qrCodeImage)
    // console.log("[INFO] successful cloudinary response: ", cloudinaryResp)


    // await Insert({_id: "gretchelglopez@gmail.com", roles:["admin", "superuser"]})

    // await counterWorkflows.IncrementStandardTickets({available: 2, reserved: 1, sold: 0})
    // const res = await counterWorkflows.GetStandardTickets()
    // console.log(res)
    //
    //
    // const res2 = await counterWorkflows.GetVIPTickets()
    // console.log(res2)

    // await dbCounters.create("vip_tickets")

    // await dbCounters.SetStandardTickets({
    //     available: 20,
    //     reserved: 1,
    //     sold: 2,
    // })

    // GenerateRelatedTickets("BZJ6-EBWH")

    // const result = await GetCheckinQRCode("ticket123")
    // console.log(result)

    // console.log(GenerateRandomID())
    // console.log(BookingPaymentStatus.PAID)
    // console.log(BookingPaymentStatus.PAID)

    // return {
    //     tickets: tickets,
    // }
    return {}
}
