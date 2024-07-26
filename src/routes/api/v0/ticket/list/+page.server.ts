
import * as ticketWorkflows from "$lib/server/workflows/tickets";
import type { Ticket } from "$lib/entities/models";

export type ServerData = {
    tickets: Ticket[],
}

export async function load({}) {
    const tickets: Ticket[] = await ticketWorkflows.GetAll()

    if (!tickets) {
        return {
            tickets: [],
        }
    }

    return {
        tickets: tickets,
    }
}
