import { NextResponse } from "next/server";
import { db } from "@/db";
import { socialMediaPlatform } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";

//done
const SocialMediaPlatformIdSchema = z
	.number({
		required_error: "Platform ID is required",
		invalid_type_error: "Platform ID must be a number",
	})
	.int("Platform ID must be an integer");

const SocialMediaPlatformSchema = z.object({
	platform_name: z
		.string()
		.trim()
		.min(1, "Platform name is required")
		.max(50, "Platform name cannot exceed 50 characters"),
	platform_link: z
		.string()
		.url("Please provide a valid URL for the platform link"),
});

// GET /social_media_platforms/:socialMediaPlatformId
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ socialMediaPlatformId: string }> }
): Promise<NextResponse> {
	try {
		const { socialMediaPlatformId } = await params;
		const platformIdValidation = SocialMediaPlatformIdSchema.safeParse(
			parseInt(socialMediaPlatformId, 10)
		);

		if (!platformIdValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid platform ID",
					message: platformIdValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		const result = await db
			.select()
			.from(socialMediaPlatform)
			.where(eq(socialMediaPlatform.platform_id, platformIdValidation.data));

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Platform not found",
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
				error: "Failed to fetch platform",
			},
			{ status: 500 }
		);
	}
}

// PUT /social_media_platforms/:socialMediaPlatformId
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ socialMediaPlatformId: string }> }
): Promise<NextResponse> {
	try {
		const { socialMediaPlatformId } = await params;

		const platformIdValidation = SocialMediaPlatformIdSchema.safeParse(
			parseInt(socialMediaPlatformId, 10)
		);

		if (!platformIdValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid platform ID",
					message: platformIdValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();
		const validation = SocialMediaPlatformSchema.safeParse(body);

		if (!validation.success) {
			const errors = validation.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Validation error",
					message: errors,
				},
				{ status: 400 }
			);
		}

		const { platform_name, platform_link } = validation.data;

		const result = await db
			.update(socialMediaPlatform)
			.set({
				platform_name,
				platform_link,
			})
			.where(eq(socialMediaPlatform.platform_id, platformIdValidation.data))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Platform not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Platform updated successfully",
			data: result[0],
		});
	} catch (error) {
		console.error("Database error:", error);

		// Check for unique constraint violation
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		if (errorMessage.includes("unique constraint")) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Platform name already exists",
					message: "A platform with this name already exists",
				},
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to update platform",
			},
			{ status: 500 }
		);
	}
}

// DELETE /social_media_platforms/:socialMediaPlatformId
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ socialMediaPlatformId: string }> }
): Promise<NextResponse> {
	try {
		const { socialMediaPlatformId } = await params;

		const platformIdValidation = SocialMediaPlatformIdSchema.safeParse(
			parseInt(socialMediaPlatformId, 10)
		);

		if (!platformIdValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid platform ID",
					message: platformIdValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		const result = await db
			.delete(socialMediaPlatform)
			.where(eq(socialMediaPlatform.platform_id, platformIdValidation.data))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Platform not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Platform deleted successfully",
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to delete platform",
			},
			{ status: 500 }
		);
	}
}
