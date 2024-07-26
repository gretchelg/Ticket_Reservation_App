import { writable } from 'svelte/store'

export let store = writable({
    user: "Admin",
})