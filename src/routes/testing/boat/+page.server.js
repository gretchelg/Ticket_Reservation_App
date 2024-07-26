// This can happen ONLY on server.
// allows us stuff like reading .env var

export function load ({ cookies })  {
    // WHAT: this should run server-side, then output is made available to the usual page.svelte
    // WHEN: runs before page.svelte is sent to client

    // fake db, just uses Cookies for storage
    const getFromDB = cookies.get
    const boatName = getFromDB('boatName')

    return {
        boatName: boatName,
    }
}

// these define handlers of form actions
export const actions = {
    // default function handles the default "submit" action of a web form
    default: async ({ request, cookies }) => {
        // receive the form data and pull out the new value of the boat name from the INPUT field
        const formData = await request.formData()
        const boatNameValue = formData.get("boatName")

        // fake db, used for storage
        const saveToDB = cookies.set

        saveToDB('boatName', boatNameValue, { path: "/"})
    }
}