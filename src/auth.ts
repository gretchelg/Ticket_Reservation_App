import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"

import {
    GOOGLE_ID,
    GOOGLE_SECRET,
} from "$env/static/private"

export const { handle } = SvelteKitAuth(async (event) => {
    const authOptions = {
        providers: [Google({clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET})],
        trustHost: true // this fixed UntrustedHost error during Netlify live deployment
    }

    return authOptions
})
