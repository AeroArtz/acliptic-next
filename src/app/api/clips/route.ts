import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db"; // Adjust this import to your Drizzle client setup
import { clip } from "@/db/schema/users"; // Import your schema
import { eq } from "drizzle-orm";
import { stream } from "@/db/schema/users";

// Updated Zod schema without start_time and end_time

//done
const ClipDataSchema = z.object({
	stream_id: z.string().trim(),
	clip_title: z.string().max(255).optional(),
	transcript: z.string().optional(),
	content_critique: z.string().optional(),
	clip_link: z.string().url().optional(),
	virality_score: z.number().min(0).max(1).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const body = await request.json();

		const clipDataResult = ClipDataSchema.safeParse(body);
		if (!clipDataResult.success) {
			const errors = clipDataResult.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid clip data",
					message: errors,
				},
				{ status: 400 }
			);
		}

		// Check if stream exists
		// const streamData = await db.query.stream.findFirst({
		// 	where: eq(stream.stream_id, clipDataResult.data.stream_id),
		// 	columns: {
		// 		stream_id: true,
		// 	},
		// });

		const streamData = await db
			.select()
			.from(stream)
			.where(eq(stream.stream_id, clipDataResult.data.stream_id));

		if (!streamData) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Stream not found",
				},
				{ status: 404 }
			);
		}

		// Prepare data for insertion
		const insertData = {
			stream_id: clipDataResult.data.stream_id,
			clip_title: clipDataResult.data.clip_title || null,
			transcript: clipDataResult.data.transcript || null,
			content_critique: clipDataResult.data.content_critique || null,
			clip_link: clipDataResult.data.clip_link || null,
			virality_score: clipDataResult.data.virality_score
				? clipDataResult.data.virality_score.toString()
				: null,
		};

		// Insert clip
		const insertedClip = await db
			.insert(clip)
			.values(insertData)
			.returning();

		return NextResponse.json({
			confirmation: "success",
			message: "Clip created successfully",
			data: insertedClip,
		});
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Unexpected error occurred",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
