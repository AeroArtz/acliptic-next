import { NextResponse } from "next/server";
import { db } from "@/db";
import { socialMediaPlatform } from "@/db/schema/users";
import { desc } from "drizzle-orm";
import { z } from "zod";

//done
const SocialMediaPlatformSchema = z.object({
	platform_id: z
		.number({
			required_error: "Platform ID is required",
			invalid_type_error: "Platform ID must be a number",
		})
		.int("Platform ID must be an integer"),
	platform_name: z
		.string()
		.trim()
		.min(1, "Platform name is required")
		.max(50, "Platform name cannot exceed 50 characters"),
	platform_link: z
		.string()
		.url("Please provide a valid URL for the platform link"),
});

// GET /social_media_platforms
export async function GET(): Promise<NextResponse> {
	try {
		// Using Drizzle's query builder instead of raw SQL
		const result = await db
			.select()
			.from(socialMediaPlatform)
			.orderBy(desc(socialMediaPlatform.created_at));

		return NextResponse.json({
			confirmation: "success",
			data: result,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to fetch social media platforms",
			},
			{ status: 500 }
		);
	}
}

// POST /social_media_platforms
export async function POST(request: Request): Promise<NextResponse> {
	try {
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

		const { platform_id, platform_name, platform_link } = validation.data;

		// Using Drizzle's insert method
		const result = await db
			.insert(socialMediaPlatform)
			.values({
				platform_id,
				platform_name,
				platform_link,
			})
			.returning();

		return NextResponse.json({
			confirmation: "success",
			message: "Platform created successfully",
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
				error: "Failed to create platform",
			},
			{ status: 500 }
		);
	}
}
