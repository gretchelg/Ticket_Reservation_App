import type { LayoutServerLoad } from "./$types"
import {error, redirect} from "@sveltejs/kit";
import * as userWorkflows from "$lib/server/workflows/users";

export const load: LayoutServerLoad = async (event) => {
  // console.log("event.locals", event.locals)
  // const session = await event.locals.auth();
  //
  // const user = await userWorkflows.GetUserFromSession(session)
  // if (!user.wasFound) {
  //   console.log("user not found")
  //   redirect(303, '/signin')
  // }
  //
  // // check if user is authorized
  // const aUser = await userWorkflows.GetByID(user._id)
  // if (!aUser) {
  //   throw error(401, `user ${user._id} unauthorized`)
  // }

  return {
    my_sub_msg: "hi from sub",
  }
}
