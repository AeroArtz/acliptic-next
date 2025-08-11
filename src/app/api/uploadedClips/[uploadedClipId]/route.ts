import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { uploadedClip } from "@/db/schema/users";
import { eq } from "drizzle-orm";

// Update schema to validate UUID format since your db schema uses UUIDs
//done
const UploadedClipIdSchema = z
	.string({
		required_error: "Upload ID is required",
		invalid_type_error: "Upload ID must be a string",
	})
	.trim()
	.min(1, "Upload ID cannot be empty")
	.uuid("Upload ID must be a valid UUID"); // Changed from regex to UUID validation

const UploadedClipUpdateSchema = z.object({
	upload_link: z
		.string({
			invalid_type_error: "Upload link must be a string",
		})
		.url("Please provide a valid URL for the upload")
		.optional(),
	uploaded_at: z
		.string()
		.datetime("Please provide a valid UTC datetime for uploaded_at")
		.optional(),
});

	// type UploadedClipParams = {
	// 	params: {
	// 		uploadedClipId: z.infer<typeof UploadedClipIdSchema>;
	// 	};
	// };

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ uploadedClipId: string }> }
): Promise<NextResponse> {
	try {
		const { uploadedClipId } = await params;

		const uploadValidation = UploadedClipIdSchema.safeParse(uploadedClipId);
		if (!uploadValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid uploaded clip ID",
					message: uploadValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// Get uploaded clip by ID
		const result = await db
			.select()
			.from(uploadedClip)
			.where(eq(uploadedClip.upload_id, uploadedClipId));

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Uploaded clip not found",
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
				error: "Failed to fetch uploaded clip",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ uploadedClipId: string }> }
): Promise<NextResponse> {
	try {
		const { uploadedClipId } = await params;

		const uploadValidation = UploadedClipIdSchema.safeParse(uploadedClipId);
		if (!uploadValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid upload ID",
					message: uploadValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();
		const uploadDataResult = UploadedClipUpdateSchema.safeParse(body);

		if (!uploadDataResult.success) {
			const errors = uploadDataResult.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid upload data",
					message: errors,
				},
				{ status: 400 }
			);
		}

		const updates = uploadDataResult.data;

		// Create updates object with only defined values
		const updateData: Partial<typeof uploadedClip.$inferSelect> = {};
		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined) {
				(updateData as any)[key] = value;
			}
		});

		// Update the uploaded clip
		const result = await db
			.update(uploadedClip)
			.set(updateData)
			.where(eq(uploadedClip.upload_id, uploadedClipId))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Uploaded clip not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Upload updated successfully",
			data: result[0],
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to update upload",
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ uploadedClipId: string }> }
): Promise<NextResponse> {
	try {
		const { uploadedClipId } = await params;

		const uploadValidation = UploadedClipIdSchema.safeParse(uploadedClipId);
		if (!uploadValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid upload ID",
					message: uploadValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// Delete the uploaded clip
		const result = await db
			.delete(uploadedClip)
			.where(eq(uploadedClip.upload_id, uploadedClipId))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Uploaded clip not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Upload deleted successfully",
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to delete upload",
			},
			{ status: 500 }
		);
	}
}
