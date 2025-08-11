// LAUNCH PLUGIN CODE

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
// Import the twitch-m3u8 package

import { db } from "@/db";
import { socialMediaHandle, users } from "@/db/schema/users";
import { eq } from "drizzle-orm";


// Define the user presets type
interface UserPresets {
  captions?: boolean | string
  // Add other preset properties as needed
}

// Define the user type with presets
interface UserWithPresets {
  id: string
  username?: string
  presets?: UserPresets | null
  // Add other user properties as needed
}

export async function POST(req: NextRequest) {
    
    try {

        // input parameter to determine if launch plugin for live stream or not
        const { video_url, auto_upload, stream_id } = await req.json()

        // Get authenticated user
        const session = await auth();

        console.log(`ID THIS BRO :${session}`);

        let user_id = session?.user?.id || "";

        if (!user_id) {
            return NextResponse.json({
                success: false,
                message: `User not authenticated!`
            }, { status: 401 });
        }

        // Get user details from database
        const result = await db.select().from(users).where(eq(users.id, user_id));
        
        if (!result.length) {
            return NextResponse.json({
                success: false,
                message: `User not found in database!`
            }, { status: 404 });
        }


        const platforms: string[] = []
        if (auto_upload) {
        // query db to get platforms with connected accounts
        const platformResult = await db
            .select({ platform_id: socialMediaHandle.platform_id })
            .from(socialMediaHandle)
            .where(eq(socialMediaHandle.user_id, user_id))

        // only if user has social media accounts connected
        if (platformResult.length > 0) {
            const id_to_platform: Record<number, string> = {
            703: "instagram",
            701: "youtube",
            }
            platformResult.forEach(({ platform_id }) => {
            const platform = id_to_platform[platform_id]
            if (platform) {
                platforms.push(platform)
            }
            })
        }
        }
        
        // Cast the user result to our typed interface and handle presets safely
        const user = result[0] as UserWithPresets
        const username = user?.username
        const captions = user?.presets?.captions || false // Provide a default value

        if (!username) {
            return NextResponse.json({
                success: false,
                message: `Username not set for user!`
            }, { status: 400 });
        }
        

        // for prerecorded video
        const response = await fetch(`http://127.0.0.1:8888/${user_id}/youtube/plugin/pre_recorded/launch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDkyMDUyNjR9.EWLMHwRlBCr4P_Jog-dmuo2Hh4JGTK8tVCmqIuTs4ig'

            },
            body: JSON.stringify({
                "streamer_id": user_id,
                "stream_id": stream_id,
                "streamer_name": username,
                "captions": captions,
                "auto_upload": {
                    "platforms" : platforms
                    // "platforms" : []
                },
                "streamData" : {
                    "twitch_username": username,
                    "url": video_url,
                    "quality": "480p",
                    "resolution": "480" // should this be hardcoded?
                }
                
                })
        });


        
        return NextResponse.json({
            success: true,
            message: `Started monitoring for streamer ${username}`,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error launching plugin:', error);

        return NextResponse.json({ 
            error: 'Failed to launch plugin', 
            details: error.message 
        }, { status: 500 });
    }
}