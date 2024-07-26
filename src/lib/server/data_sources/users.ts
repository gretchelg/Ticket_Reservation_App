import * as mongoose from "mongoose";
import type { User } from "$lib/entities/models"

const usersSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    roles: [
        {
            type: String,
            required: true
        }
    ],
});

const dbCollection = await mongoose.model("Users2", usersSchema)


// Insert inserts a new record in the database.
export async function Insert(user: User): Promise<void> {
    const aUser = {
        _id: user._id,
        roles: user.roles,
    }
    await dbCollection.create(aUser)
}

// GetByID gets a record by the given ID
export async function GetByID(id: string): Promise<User | null> {
    const aUser = await dbCollection.findOne({_id: id})

    // not found
    if (!aUser){
        return null
    }

    return {
        _id: aUser._id,
        roles: aUser.roles,
    }
}

