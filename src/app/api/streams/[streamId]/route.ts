import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { stream } from "@/db/schema/users";
import { eq } from "drizzle-orm";

// Stream ID validation (UUID format)
//done
const StreamIdSchema = z
	.string({
		required_error: "Stream ID is required",
		invalid_type_error: "Stream ID must be a string",
	})
	.uuid("Stream ID must be a valid UUID");

// Stream update data schema validation
const StreamUpdateSchema = z
	.object({
		stream_title: z
			.string({
				invalid_type_error: "Stream title must be a string",
			})
			.min(1, "Stream title must not be empty")
			.optional(),
		stream_link: z
			.string({
				invalid_type_error: "Stream link must be a string",
			})
			.url("Please provide a valid URL for the stream link")
			.optional(),
		thumbnail_url: z.string().url().optional(),
		stream_start: z
			.string({
				invalid_type_error: "Stream start time must be a string",
			})
			.datetime("Please provide a valid start time in ISO 8601 format")
			.optional(),
		stream_end: z
			.string({
				invalid_type_error: "Stream end time must be a string",
			})
			.datetime("Please provide a valid end time in ISO 8601 format")
			.optional(),
		transcript: z
			.string({
				invalid_type_error: "Transcript must be a string",
			})
			.optional(),
		auto_upload: z
			.boolean({
				invalid_type_error: "Auto upload must be a boolean",
			})
			.optional(),
	})
	.refine(
		(data) => {
			// Only validate if both dates are present
			if (data.stream_start && data.stream_end) {
				return new Date(data.stream_end) > new Date(data.stream_start);
			}
			// If one or both dates are missing, consider it valid
			return true;
		},
		{
			message: "Stream end time must be after stream start time",
			path: ["stream_end"],
		}
	);

// Type for capturing params containing the streamId
type StreamParams = {
	params: {
		streamId: z.infer<typeof StreamIdSchema>;
	};
};

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ streamId: string }> }
): Promise<NextResponse> {
	try {
		const { streamId } = await params;
		console.log(streamId);

		// Validate the streamId using zod schema
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

		// Fetch stream data from database using Drizzle
		const result = await db
			.select()
			.from(stream)
			.where(eq(stream.stream_id, streamId));

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Stream not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			data: result[0],
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to fetch stream",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ streamId: string }> }
): Promise<NextResponse> {
	try {
		const { streamId } = await params;

		// Validate the streamId using zod schema
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

		const body = await request.json();
		const streamDataResult = StreamUpdateSchema.safeParse(body);

		if (!streamDataResult.success) {
			const errors = streamDataResult.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid stream data",
					message: errors,
				},
				{ status: 400 }
			);
		}

		const updates = streamDataResult.data;

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "No valid fields to update",
				},
				{ status: 400 }
			);
		}

		// Prepare update data (convert date strings to Date objects if present)
		const updateData: Partial<typeof stream.$inferSelect> = {};
		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined) {
				if (key === 'stream_start' || key === 'stream_end') {
					(updateData as any)[key] = new Date(value as string);
				} else {
					(updateData as any)[key] = value;
				}
			}
		});

		// Update the stream in database
		const result = await db
			.update(stream)
			.set(updateData)
			.where(eq(stream.stream_id, streamId))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Stream not found or update failed",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Stream updated successfully",
			data: result[0],
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to update stream",
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ streamId: string }> }
): Promise<NextResponse> {
	try {
		const { streamId } = await params;

		// Validate the streamId using zod schema
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

		// Delete the stream from database
		const result = await db
			.delete(stream)
			.where(eq(stream.stream_id, streamId))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Stream not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Stream deleted successfully",
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to delete stream",
			},
			{ status: 500 }
		);
	}
}
