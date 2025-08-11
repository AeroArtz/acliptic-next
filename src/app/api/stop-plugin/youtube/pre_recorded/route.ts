// STOP PLUGIN CODE
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {

    
    try {
        // Get authenticated user using NextAuth
        const session = await auth();
        const user_id = session?.user?.id || "";

        if (!user_id) {
            return NextResponse.json({
                success: false,
                message: `User not authenticated!`
            }, { status: 401 });
        }

        // update the DB
        await db.update(users)
        .set({ plugin_active: false })
        .where(eq(users.id, user_id))

        // Get user details from database
        const result = await db.select().from(users).where(eq(users.id, user_id));
        
        if (!result.length) {
            return NextResponse.json({
                success: false,
                message: `User not found in database!`
            }, { status: 404 });
        }
        
        const username = result[0]?.username;

        if (!username) {
            return NextResponse.json({
                success: false,
                message: `Username not set for user!`
            }, { status: 400 });
        }

        // send api request

            const response = await fetch(`http://127.0.0.1:8888/${user_id}/youtube/plugin/pre_recorded/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDkyMDUyNjR9.EWLMHwRlBCr4P_Jog-dmuo2Hh4JGTK8tVCmqIuTs4ig'

                },
                body: JSON.stringify({
                    "streamer_id": user_id,
                    "streamer_name": username,    
                })
            });

        
        
        return NextResponse.json({
            success: true,
            message: `Stopped monitoring for streamer ${username}`
        }, { status: 200 });
    } catch (error: unknown) {

        console.error('Error stopping plugin:', error);
        return NextResponse.json({ 
            error: 'Failed to stop plugin', 
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    } 
}