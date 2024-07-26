import {error, redirect} from '@sveltejs/kit';

import type { Email } from "$lib/entities/models";
import * as emailWorkflows from "$lib/server/workflows/emails";

// export async function load({ event, params }) {
// }

// actions handle Form Actions
export const actions = {
    // "default" handles form="submit" action
    default: sendEmail
}

async function sendEmail({ request, fetch }): Promise<void> {
    // receive form data values
    const formData = await request.formData()

    const to = formData.get("to")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // send the email
    const email: Email = {
        from: "", // note: value will be replaced with a hardcoded required value
        to: to,
        subject: subject,
        message: message
    }

    // try {
    //     await emailWorkflows.Send(email)
    // } catch(e) {
    //     // on failure, redirect to error page
    //     throw redirect(303, '/testing/emailsender/fail');
    // }
    await emailWorkflows.Send(email)


    // on success, redirect to success page
    throw redirect(303, '/testing/emailsender/success');
}