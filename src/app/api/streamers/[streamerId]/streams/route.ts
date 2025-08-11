import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db"; // Drizzle client
import { clip, stream, users } from "@/db/schema/users"; // Import your schema
import { eq, sql } from "drizzle-orm";

//done
const StreamerIdSchema = z
	.string({
		required_error: "Streamer ID is required",
		invalid_type_error: "Streamer ID must be a string",
	})
	.trim()
	.min(1, "Streamer ID cannot be empty")
	.uuid("Streamer ID must be a valid UUID");

// type StreamerParams = {
// 	params: {
// 		streamerId: z.infer<typeof StreamerIdSchema>;
// 	};
// };

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ streamerId: string }> }
): Promise<NextResponse> {
	try {
		const { streamerId } = await params;
		const validationResult = StreamerIdSchema.safeParse(streamerId);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid streamer ID",
					message: validationResult.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// First, check if the user exists
		const userData = await db
			.select()
			.from(users)
			.where(eq(users.id, streamerId));

		if (userData.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "User not found",
				},
				{ status: 404 }
			);
		}

		// Get all streams for this user
		//get clip count and send it down as well
		const streamsWithClipCounts = await db
			.select({
				stream_id: stream.stream_id,
				user_id: stream.user_id,
				stream_title: stream.stream_title,
				stream_link: stream.stream_link,
				stream_start: stream.stream_start,
				stream_end: stream.stream_end,
				auto_upload: stream.auto_upload,
				thumbnail_url: stream.thumbnail_url,
				created_at: stream.created_at,
				updated_at: stream.updated_at,
				clipCount: sql<number>`COUNT(${clip.clip_id})`,
			})
			.from(stream)
			.leftJoin(clip, eq(clip.stream_id, stream.stream_id))
			.where(eq(stream.user_id, streamerId))
			.groupBy(stream.stream_id);
		console.log(streamsWithClipCounts);

		return NextResponse.json({
			confirmation: "success",
			data: streamsWithClipCounts,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to fetch user streams",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
