import { db } from "@/db"
import { clip, stream } from "@/db/schema/users"
import { and, eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { streamerId, stream_id } = await request.json()

    if (!streamerId || !stream_id) {
      return NextResponse.json(
        {
          confirmation: "fail",
          message: "streamer ID and stream ID is required",
        },
        { status: 400 },
      )
    }

    const streamsWithClipCounts = await db
            .select({
            stream_id: stream.stream_id,
            user_id: stream.user_id,
            clipCount: sql<number>`COUNT(${clip.clip_id})`,
            })
            .from(stream)
            .leftJoin(clip, eq(clip.stream_id, stream.stream_id))
            .where(and(
            eq(stream.user_id, streamerId),
            eq(stream.stream_id, stream_id)
            ))
            .groupBy(stream.stream_id);

    return NextResponse.json(
        {
        confirmation: "success",
        message: "Fetched clip count successfully",
        data: streamsWithClipCounts,
        },
        { status: 200 },
    )
    

 
  } catch (error) {
    console.error("Error fetching presets:", error)

    return NextResponse.json(
      {
        confirmation: "fail",
        message: "Failed to get clip count",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

