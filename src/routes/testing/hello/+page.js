// This can happen on both client and server

export const load = (async () => {
    // this runs at server-side, then output is made available to the usual page.svelte

    return {
        title: 'My data',
        text: 'Freundin'
    }

})

// export async function load (): Promise<any> | Pa {
//
//     return {
//         title: 'My data',
//         text: 'Ma'
//     }
// }