import type {SessionUser, User} from "$lib/entities/models"
import * as db from "$lib/server/data_sources/users";

// GetByID gets a ticket by ID and returns it
export async function GetByID(id: string): Promise<User | null> {
   return await db.GetByID(id)
}



// GetUserFromPageLoadEvent gets the user from the page load event of sveltekit.
export async function GetUserFromSession(session): Promise<SessionUser> {
   if (!session) {
      return {
            userName: "",
            _id: "",
            isASuperUser: false,
            wasFound: false,
      }
   }

   // check if user is present
   const user = session?.user
   if (!user) {
      return {
            userName: "",
            _id: "",
            isASuperUser: false,
            wasFound: false,
      }
   }

   // TODO consider fetching the user from the db

   // check authorization level
   const userID = user.email
   const isASuperUser = ["thangersam@gmail.com", "gretchelglopez@gmail.com"].indexOf(userID) !== -1

   return {
      userName: user.name,
      _id: userID,
      isASuperUser: isASuperUser,
      wasFound: true,
   }

}