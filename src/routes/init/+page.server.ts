
import * as dbCounters from "$lib/server/data_sources/counters";
import * as dbUsers from "$lib/server/data_sources/users";
import type {User} from "$lib/entities/models";
import {redirect} from "@sveltejs/kit";

// This page is just to init the data, like when we have a new environment set up

export async function load({}) {

    throw redirect(303, "/")
}
