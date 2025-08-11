import { NextResponse } from "next/server";
import { db } from "@/db";
import { socialMediaHandle, socialMediaPlatform } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";

//done
// Updating the ID schema to use UUID format since your schema now uses UUID
const SocialMediaHandleIdSchema = z
	.string({
		required_error: "Handle ID is required",
		invalid_type_error: "Handle ID must be a string",
	})
	.trim()
	.min(1, "Handle ID cannot be empty")
	.uuid("Handle ID must be a valid UUID");

const SocialMediaHandleUpdateSchema = z.object({
	account_handle: z
		.string()
		.trim()
		.min(1)
		.max(100)
		.regex(/^[A-Za-z0-9._-]+$/)
		.optional(),
	access_token: z.string().trim().min(1).optional(),
	refresh_token: z.string().trim().min(1).optional(),
	token_expires_at: z.string().datetime().optional(),
	refresh_token_expires_at: z.string().datetime().optional(),
	account_user_id: z.string().optional(),
});

//zod validation
// const datetime = z.string().datetime();

// datetime.parse("2020-01-01T00:00:00Z"); // pass
// datetime.parse("2020-01-01T00:00:00.123Z"); // pass
// datetime.parse("2020-01-01T00:00:00.123456Z"); // pass (arbitrary precision)
// datetime.parse("2020-01-01T00:00:00+02:00"); // fail (no offsets allowed)
// Timezone offsets can be allowed by setting the offset option to true.

// const datetime = z.string().datetime({ offset: true });

// datetime.parse("2020-01-01T00:00:00+02:00"); // pass
// datetime.parse("2020-01-01T00:00:00.123+02:00"); // pass (millis optional)
// datetime.parse("2020-01-01T00:00:00.123+0200"); // pass (millis optional)
// datetime.parse("2020-01-01T00:00:00.123+02"); // pass (only offset hours)
// datetime.parse("2020-01-01T00:00:00Z"); // pass (Z still supported)

// type SocialMediaHandleParams = {
// 	params: {
// 		socialMediaHandleId: z.infer<typeof SocialMediaHandleIdSchema>;
// 	};
// };

export async function GET(
	request: Request,
	{ params } : { params: Promise<{ socialMediaHandleId: string }> }
	): Promise<NextResponse> {
	try {
		const { socialMediaHandleId } = await params;
		const socialMediaHandleValidation =
			SocialMediaHandleIdSchema.safeParse(socialMediaHandleId);

		if (!socialMediaHandleValidation.success) {
			return NextResponse.json(
				{
					
					confirmation: "fail",
					error: "Invalid handle ID",
					message:
						socialMediaHandleValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// Using drizzle for the query
		const result = await db
			.select({
				handle_id: socialMediaHandle.handle_id,
				user_id: socialMediaHandle.user_id,
				platform_id: socialMediaHandle.platform_id,
				account_handle: socialMediaHandle.account_handle,
				access_token: socialMediaHandle.access_token,
				platform_name: socialMediaPlatform.platform_name,
				platform_link: socialMediaPlatform.platform_link,
			})
			.from(socialMediaHandle)
			.innerJoin(
				socialMediaPlatform,
				eq(
					socialMediaHandle.platform_id,
					socialMediaPlatform.platform_id
				)
			)
			.where(eq(socialMediaHandle.handle_id, socialMediaHandleId));
		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Social Media Handle not found",
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
				error: "Failed to fetch Social Media Handle",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ socialMediaHandleId: string }> }
): Promise<NextResponse> {
	try {
		const { socialMediaHandleId } = await params;

		const socialMediaHandleValidation =
			SocialMediaHandleIdSchema.safeParse(socialMediaHandleId);

		if (!socialMediaHandleValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid handle ID",
					message:
						socialMediaHandleValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();
		const socialMediaHandleDataResult =
			SocialMediaHandleUpdateSchema.safeParse(body);

		if (!socialMediaHandleDataResult.success) {
			const errors = socialMediaHandleDataResult.error.issues.map(
				(issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})
			);
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid social media handle update data",
					message: errors,
				},
				{ status: 400 }
			);
		}

		const updateData = socialMediaHandleDataResult.data;

		// If updating account_handle, check for uniqueness
		// if (updateData.account_handle) {
		// 	// First get the platform_id for this handle
		// 	const existingHandle = await db
		// 		.select({ platform_id: socialMediaHandle.platform_id })
		// 		.from(socialMediaHandle)
		// 		.where(eq(socialMediaHandle.handle_id, socialMediaHandleId));

		// 	if (existingHandle.length > 0) {
		// 		const platformId = existingHandle[0].platform_id;

		// 		// Check if this account_handle already exists for this platform
		// 		const duplicateHandle = await db
		// 			.select({ handle_id: socialMediaHandle.handle_id })
		// 			.from(socialMediaHandle)
		// 			.where(
		// 				and(
		// 					eq(socialMediaHandle.platform_id, platformId),
		// 					eq(
		// 						socialMediaHandle.account_handle,
		// 						updateData.account_handle
		// 					),
		// 					ne(socialMediaHandle.handle_id, socialMediaHandleId)
		// 				)
		// 			);
		// 		if (duplicateHandle.length > 0) {
		// 			return NextResponse.json(
		// 				{
		// 					confirmation: "fail",
		// 					error: "Account handle already exists for this platform",
		// 				},
		// 				{ status: 409 }
		// 			);
		// 		}
		// 	}
		// }

		// Filter out undefined values
		const updates: Record<string, string | Date> = {};
		Object.entries(updateData).forEach(([key, value]) => {
			if (value !== undefined) {
				if (
					key === "token_expires_at" ||
					key === "refresh_token_expires_at"
				) {
					updates[key] = new Date(value);
				} else {
					updates[key] = value;
				}
			}
		});
		console.log("updates", updates);
		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "No valid fields to update",
				},
				{ status: 400 }
			);
		}

		// Perform the update with drizzle
		const result = await db
			.update(socialMediaHandle)
			.set(updates)
			.where(eq(socialMediaHandle.handle_id, socialMediaHandleId))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Social Media Handle not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Social Media Handle updated successfully",
			data: result[0],
		});
	} catch (error) {
		console.error("Database error:", error);
		// Check for unique constraint violation
		// const errorMessage =
		// 	error instanceof Error ? error.message : String(error);
		// if (errorMessage.includes("unique constraint")) {
		// 	return NextResponse.json(
		// 		{
		// 			confirmation: "fail",
		// 			error: "Unique constraint violation",
		// 			message: "Account handle must be unique for this platform",
		// 		},
		// 		{ status: 409 }
		// 	);
		// }

		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to update social media handle",
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ socialMediaHandleId: string }> }
): Promise<NextResponse> {
	try {
		const { socialMediaHandleId } = await params;

		const socialMediaHandleValidation =
			SocialMediaHandleIdSchema.safeParse(socialMediaHandleId);

		if (!socialMediaHandleValidation.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid social media handle ID",
					message:
						socialMediaHandleValidation.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// Using drizzle for the delete operation
		const result = await db
			.delete(socialMediaHandle)
			.where(eq(socialMediaHandle.handle_id, socialMediaHandleId))
			.returning({ handle_id: socialMediaHandle.handle_id });

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Social Media Handle not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Social Media Handle deleted successfully",
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to delete social media handle",
			},
			{ status: 500 }
		);
	}
}
