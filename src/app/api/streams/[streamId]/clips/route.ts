import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { stream, clip } from "@/db/schema/users";
import { eq, desc } from "drizzle-orm";

//done
const StreamIdSchema = z
	.string({
		required_error: "Stream ID is required",
		invalid_type_error: "Stream ID must be a string",
	})
	.trim()
	.uuid("Stream ID must be a valid UUID");

// type StreamParams = {
// 	params: {
// 		streamId: z.infer<typeof StreamIdSchema>;
// 	};
// };

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ streamId: string }> }
): Promise<NextResponse> {
	try {
		const { streamId } = await params;

		const streamValidation = StreamIdSchema.safeParse(streamId);
		if (!streamValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid stream ID",
					message: streamValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// First, verify the stream exists
		const streamCheck = await db
			.select()
			.from(stream)
			.where(eq(stream.stream_id, streamId));

		if (streamCheck.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Stream not found",
				},
				{ status: 404 }
			);
		}

		// Fetch clips for the stream
		const clips = await db
			.select()
			.from(clip)
			.where(eq(clip.stream_id, streamId))
			.orderBy(desc(clip.created_at));

		if (clips.length === 0) {
			return NextResponse.json({
				confirmation: "success",
				message: "No clips found for this stream",
				data: [],
			});
		}

		return NextResponse.json({
			confirmation: "success",
			data: clips,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to fetch clips",
			},
			{ status: 500 }
		);
	}
}
