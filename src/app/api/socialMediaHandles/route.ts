import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import {
	socialMediaHandle,
	socialMediaPlatform,
	users,
} from "@/db/schema/users";
import { eq } from "drizzle-orm";

//done
// Schema for social media handle validation
const SocialMediaHandleSchema = z
	.object({
		user_id: z
			.string({
				required_error: "User ID is required",
			})
			.uuid("user  ID must be a valid UUID"),
		platform_id: z
			.number({
				required_error: "Platform ID is required",
				invalid_type_error: "Platform ID must be a number",
			})
			.int("Platform ID must be an integer"),

		account_handle: z
			.string({
				required_error: "Account handle is required",
				invalid_type_error: "Account handle must be a string",
			})
			.trim()
			.min(1, "Account handle must not be empty")
			.max(100, "Account handle must not exceed 100 characters")
			.regex(
				/^[A-Za-z0-9._-]+$/,
				"Account handle can only contain letters, numbers, dots, underscores, and hyphens"
			),
		access_token: z
			.string({
				required_error: "Access token is required",
				invalid_type_error: "Access token must be a string",
			})
			.trim()
			.min(1, "Access token must not be empty"),
		refresh_token: z
			.string({
				invalid_type_error: "Refresh token must be a string",
			})
			.trim()
			.optional(),
		token_expires_at: z
			.string({
				invalid_type_error: "Token expiration time must be a string",
			})
			.datetime(
				"Please provide a valid expiration time in ISO 8601 format"
			)
			.optional(),
		refresh_token_expires_at: z
			.string({
				invalid_type_error:
					"Refresh token expiration time must be a string",
			})
			.datetime(
				"Please provide a valid expiration time in ISO 8601 format"
			)
			.optional(),
		account_user_id: z.string().optional(),
	})
	.refine(
		(data) => {
			// If refresh_token is provided, token_expires_at should also be provided
			if (data.refresh_token && !data.token_expires_at) {
				return false;
			}
			return true;
		},
		{
			message:
				"Token expiration time is required when refresh token is provided",
			path: ["token_expires_at"],
		}
	);

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const body = await request.json();

		// Validate request body
		const socialMediaHandleResult = SocialMediaHandleSchema.safeParse(body);
		if (!socialMediaHandleResult.success) {
			const errors = socialMediaHandleResult.error.issues.map(
				(issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})
			);
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid social media handle data",
					message: errors,
				},
				{ status: 400 }
			);
		}

		// Check if user exists
		// const userExists = await db.query.users.findFirst({
		// 	where: eq(users.id, socialMediaHandleResult.data.user_id),
		// 	columns: { id: true },
		// });

		const userExists = await db
			.select()
			.from(users)
			.where(eq(users.id, socialMediaHandleResult.data.user_id));

		if (!userExists) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "User not found",
				},
				{ status: 404 }
			);
		}

		// Check if platform exists
		// const platformExists = await db.query.socialMediaPlatform.findFirst({
		// 	where: eq(
		// 		socialMediaPlatform.platform_id,
		// 		socialMediaHandleResult.data.platform_id
		// 	),
		// 	columns: { platform_id: true },
		// });

		const platformExists = await db
			.select()
			.from(socialMediaPlatform)
			.where(
				eq(
					socialMediaPlatform.platform_id,
					socialMediaHandleResult.data.platform_id
				)
			);

		if (!platformExists) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Social Media Platform not found",
				},
				{ status: 404 }
			);
		}

		// Check for existing handle for this user-platform combination

		// const existingHandle = await db
		// 	.select()
		// 	.from(socialMediaHandle)
		// 	.where(
		// 		and(
		// 			eq(
		// 				socialMediaHandle.user_id,
		// 				socialMediaHandleResult.data.user_id
		// 			),
		// 			eq(
		// 				socialMediaHandle.platform_id,
		// 				socialMediaHandleResult.data.platform_id
		// 			)
		// 		)
		// 	);

		// if (existingHandle) {
		// 	return NextResponse.json(
		// 		{
		// 			confirmation: "fail",
		// 			error: "Social media handle already exists for this platform-user combination",
		// 		},
		// 		{ status: 409 }
		// 	);
		// }

		// Check for existing account handle on the platform
		// const existingAccount = await db
		// 	.select()
		// 	.from(socialMediaHandle)
		// 	.where(
		// 		and(
		// 			eq(
		// 				socialMediaHandle.platform_id,
		// 				socialMediaHandleResult.data.platform_id
		// 			),
		// 			eq(
		// 				socialMediaHandle.account_handle,
		// 				socialMediaHandleResult.data.account_handle
		// 			)
		// 		)
		// 	);

		// if (existingAccount) {
		// 	return NextResponse.json(
		// 		{
		// 			confirmation: "fail",
		// 			error: "This account handle is already connected to this platform for another user",
		// 		},
		// 		{ status: 409 }
		// 	);
		// }

		// Prepare data for insertion
		const {
			user_id,
			platform_id,
			account_handle,
			access_token,
			refresh_token,
			token_expires_at,
			refresh_token_expires_at,
			account_user_id,
		} = socialMediaHandleResult.data;

		// Format date fields if present
		const formattedTokenExpiresAt = token_expires_at
			? new Date(token_expires_at)
			: null;
		const formattedRefreshTokenExpiresAt = refresh_token_expires_at
			? new Date(refresh_token_expires_at)
			: null;

		// Insert new social media handle
		const [newHandle] = await db
			.insert(socialMediaHandle)
			.values({
				user_id,
				platform_id,
				account_handle,
				access_token,
				refresh_token: refresh_token || null,
				token_expires_at: formattedTokenExpiresAt,
				refresh_token_expires_at: formattedRefreshTokenExpiresAt,
				account_user_id: account_user_id || null,
			})
			.returning();

		return NextResponse.json({
			confirmation: "success",
			message: "Social Media Handle created successfully",
			data: newHandle,
		});
	} catch (error) {
		console.error("Error creating social media handle:", error);

		// Check for specific constraint violations
		if (error instanceof Error) {
			const errorMessage = error.message;

			// Handle unique constraint violations
			if (errorMessage.includes("unique_user_platform")) {
				return NextResponse.json(
					{
						confirmation: "fail",
						error: "Social media handle already exists for this platform-user combination",
					},
					{ status: 409 }
				);
			} else if (errorMessage.includes("unique_platform_handle")) {
				return NextResponse.json(
					{
						confirmation: "fail",
						error: "This account handle is already connected to this platform for another user",
					},
					{ status: 409 }
				);
			}
		}

		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to create Social Media Handle",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
