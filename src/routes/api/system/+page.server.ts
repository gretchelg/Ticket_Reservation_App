import * as system from "$lib/server/workflows/system"
import * as userWorkflows from "$lib/server/workflows/users";
import {error} from "@sveltejs/kit";

export type ServerData = {
    newBookingsAllowed: boolean,
}

export async function load({ event, locals }): Promise<ServerData> {
    // reject non-superusers
    const session = await locals.auth();

    const user = await userWorkflows.GetUserFromSession(session)
    if (!user.isASuperUser) {
        throw error(401, "unauthorized, must be a superuser")
    }

    // fetch system data
    const newBookingsAllowed = system.GetNewBookingsAllowed()

    return {
        newBookingsAllowed: newBookingsAllowed,
    }
}

// actions handle Form Actions
export const actions = {
    toggleNewBookingsAllowed: toggleNewBookingsAllowed,
}

async function toggleNewBookingsAllowed({ request, params }) {
    system.SetNewBookingsAllowed(!system.GetNewBookingsAllowed())
}