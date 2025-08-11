// LAUNCH PLUGIN CODE
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"
// Import the twitch-m3u8 package
import twitch from "twitch-m3u8"
import { db } from "@/db"
import { socialMediaHandle, users } from "@/db/schema/users"
import { eq } from "drizzle-orm"

// Define types for better TypeScript support
interface StreamInfo {
  url: string
  quality: string
  resolution: string
}

interface StreamData {
  url: string
  quality: string
  resolution: string
}

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
 
// Helper function to get 480p stream URL or closest available
async function get_m3u8_twitch_live(channelName: string): Promise<StreamInfo> {
  try {
    const streamResponse = await twitch.getStream(channelName)

    // Handle both single object and array responses
    let streams: StreamData[]
    if (Array.isArray(streamResponse)) {
      streams = streamResponse
    } else {
      // If it's a single object, wrap it in an array
      streams = [streamResponse as StreamData]
    }

    if (streams.length === 0) {
      throw new Error("Streamer is not live")
    }

    // Look for 480p specifically
    let streamUrl = null
    let targetStream = streams.find(
      (stream) =>
        stream.quality?.includes("480p") || stream.resolution === "854x480" || stream.resolution === "852x480",
    )

    // If 480p not found, get the closest available quality that's not higher than 720p
    if (!targetStream) {
      // Sort streams by resolution (assuming format is WIDTHxHEIGHT)
      const sortedStreams = streams
        .filter((stream) => stream.resolution)
        .map((stream) => {
          const height = Number.parseInt(stream.resolution.split("x")[1])
          return { ...stream, height }
        })
        .sort((a, b) => a.height - b.height)

      // Find the first stream with resolution <= 720p but closest to 480p
      targetStream = sortedStreams.find((stream) => stream.height <= 720) || sortedStreams[0]
    }

    if (targetStream) {
      streamUrl = targetStream.url
    } else {
      // Fallback to the first available stream if no suitable stream found
      streamUrl = streams[0].url
    }

    return {
      url: streamUrl,
      quality: targetStream ? targetStream.quality : streams[0].quality,
      resolution: targetStream ? targetStream.resolution : streams[0].resolution,
    }
  } catch (error: any) {
    throw new Error(`Failed to get Twitch stream URL: ${error.message}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    // input parameter to determine if launch plugin for live stream or not
    const { auto_upload, stream_id } = await req.json()

    // Get authenticated user
    const session = await auth()
    console.log(`ID THIS BRO :${session}`)
    const user_id = session?.user?.id || ""

    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          message: `User not authenticated!`,
        },
        { status: 401 },
      )
    }

    // Get user details from database with proper typing
    const result = await db.select().from(users).where(eq(users.id, user_id))

    if (!result.length) {
      return NextResponse.json(
        {
          success: false,
          message: `User not found in database!`,
        },
        { status: 404 },
      )
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

    console.log("platforms after updating:")
    console.log(platforms)

    // Cast the user result to our typed interface and handle presets safely
    const user = result[0] as UserWithPresets
    const username = user?.username
    const captions = user?.presets?.captions || false // Provide a default value

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: `Username not set for user!`,
        },
        { status: 400 },
      )
    }

    // for live stream
    // Get the m3u8 URL for the Twitch stream (480p preferably)
    let streamData: StreamInfo
    try {
      //streamData = await get_m3u8_twitch_live('caedrel');
      streamData = await get_m3u8_twitch_live(username)
      console.log(`Found stream for ${username}:`, streamData)
    } catch (streamError: any) {
      return NextResponse.json(
        {
          success: false,
          message: streamError.message,
        },
        { status: 400 },
      )
    }

    if (streamData) {
      const response = await fetch(`http://127.0.0.1:8888/${user_id}/twitch/plugin/launch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDkyMDUyNjR9.EWLMHwRlBCr4P_Jog-dmuo2Hh4JGTK8tVCmqIuTs4ig",
        },
        body: JSON.stringify({
          streamer_id: user_id,
          stream_id: stream_id,
          streamer_name: username,
          captions: captions,
          auto_upload: {
            platforms: platforms,
            // "platforms" : []
          },
          streamData: {
            twitch_username: username,
            url: streamData?.url,
            quality: streamData?.quality,
            resolution: streamData?.resolution,
          },
        }),
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: `Started monitoring for streamer ${username}`,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error launching plugin:", error)
    return NextResponse.json(
      {
        error: "Failed to launch plugin",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
