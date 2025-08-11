import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(request: Request): Promise<NextResponse> {

    const { user_id, username, phone_number, youtube_channel_id } = await request.json()

    try{

        await db.update(users)
        .set({ username: username, phone_number: phone_number, youtube_channel_id: youtube_channel_id })
        .where(eq(users.id, user_id ));
    
        return NextResponse.json(
            {
                confirmation: "Success",
                message: "Updated user Profile Successfully",
            },
            { status: 200 }
        );

    } catch(error){
        console.log(error)
        return NextResponse.json(
            {
                confirmation: "fail",
                error: "Failed to update user profile",
            },
            { status: 500 }
        );
    }
}
