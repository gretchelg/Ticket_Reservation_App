// This can only run on the server

// qrcode is the package for generating QR code from a given URL
import QRCode from "qrcode";

export const load = (async (event) => {
    // this runs at on initial page load at server-side, then output is made available to the usual page.svelte

    // get url from the query param
    const url = event.url.searchParams.get('xurl')
    if (!url) {
        // empty url? nothing to do (likely an initial page load)
        return {}
    }

    // generate QR code image
    const qrCodeImage = await QRCode.toDataURL(url);

    // send image to the client
    return {
        qrCodeImage: qrCodeImage,
        targetUrl: url,
    }
})

