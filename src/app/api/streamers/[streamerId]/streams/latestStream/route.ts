import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { stream } from "@/db/schema/users";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

// Validation schema for streamer ID
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
	req: NextRequest,
	{ params }: { params: Promise<{ streamerId: string }> }
) {
	try {
		const { streamerId } = await params;
		console.log("streamerid", streamerId);
		// Validate the streamerId
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

		// Query the latest stream for the user
		const latestStream = await db
			.select()
			.from(stream)
			.where(eq(stream.user_id, streamerId))
			.orderBy(desc(stream.created_at))
			.limit(1);

		// Check if any streams were found
		if (latestStream.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "No streams found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			data: latestStream,
		});
	} catch (error) {
		console.error("Error fetching latest stream:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
