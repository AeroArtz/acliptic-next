import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";

//done
// Schema for validating streamer ID in URL params
const StreamerIdSchema = z
	.string({
		required_error: "Streamer ID is required",
		invalid_type_error: "Streamer ID must be a string",
	})
	.trim()
	.min(1, "Streamer ID cannot be empty")
	.uuid("Streamer ID must be a valid UUID");

// Schema for validating update data
const StreamerUpdateSchema = z.object({
	email: z
		.string({
			invalid_type_error: "Email must be a string",
		})
		.email("Please enter a valid email address")
		.optional(),

	name: z
		.string({
			invalid_type_error: "Name must be a string",
		})
		.min(1, "Name cannot be empty")
		.optional(),

	username: z
		.string({
			invalid_type_error: "Username must be a string",
		})
		.min(1, "Username cannot be empty")
		.optional(),

	image: z
		.string({
			invalid_type_error: "Profile picture link must be a string",
		})
		.url("Please enter a valid URL for the profile picture")
		.optional(),

	phone_number: z
		.string({
			invalid_type_error: "Phone number must be a string",
		})
		.regex(
			/^\+[1-9]\d{7,14}$/,
			"Please enter a valid phone number in E.164 format starting with + and containing 8-15 digits (e.g., +1234567890)"
		)
		.optional(),

	onBoardingCompleted: z
		.boolean({
			invalid_type_error: "onBoardingCompleted must be a boolean",
		})
		.optional(),
});

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

		// Using Drizzle ORM to fetch the user
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, streamerId));

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Streamer not found",
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
				error: "Failed to fetch streamer",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ streamerId: string }> }
): Promise<NextResponse> {
	try {
		const { streamerId } = await params;

		const streamerValidationResult = StreamerIdSchema.safeParse(streamerId);

		if (!streamerValidationResult.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid streamer ID",
					message: streamerValidationResult.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();
		const validationResult = StreamerUpdateSchema.safeParse(body);

		if (!validationResult.success) {
			const errors = validationResult.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));

			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Validation failed",
					message: errors,
				},
				{ status: 400 }
			);
		}

		const updateData = validationResult.data;

		// Create updates object with only defined values
		const updates: Partial<typeof users.$inferSelect> = {};
		Object.entries(updateData).forEach(([key, value]) => {
			if (value !== undefined) {
				(updates as any)[key] = value;
			}
		});

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "No valid fields to update",
				},
				{ status: 400 }
			);
		}

		// Perform the update with Drizzle
		const result = await db
			.update(users)
			.set(updates)
			.where(eq(users.id, streamerId))
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Streamer not found",
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

		// Check for unique constraint violation
		// const errorMessage =
		// 	error instanceof Error ? error.message : String(error);
		// if (errorMessage.includes("unique constraint")) {
		// 	return NextResponse.json(
		// 		{
		// 			confirmation: "fail",
		// 			error: "Email already exists",
		// 		},
		// 		{ status: 409 }
		// 	);
		// }

		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to update streamer",
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		// Using Drizzle ORM to delete the user
		const result = await db
			.delete(users)
			.where(eq(users.id, streamerId))
			.returning({ id: users.id });

		if (result.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Streamer not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			confirmation: "success",
			message: "Streamer deleted successfully",
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to delete streamer",
			},
			{ status: 500 }
		);
	}
}






























// /api/streamers/route.ts
// import { NextResponse } from "next/server";
// import { pool } from "@/lib/db/dbConfig";
// import { type QueryResult } from "pg";

// //verified

// export async function GET(request: Request): Promise<NextResponse> {
// 	try {
// 		const query = `
//       SELECT
//         streamer_id,
//         email,
//         profile_picture_link,
//         first_name,
//         last_name,
//         account_status,
//         last_login_at
//       FROM streamer
//       ORDER BY created_at DESC
//     `;
// 		const result: QueryResult = await pool.query(query);
// 		return NextResponse.json({
// 			confirmation: "success",
// 			data: result.rows,
// 		});
// 	} catch (error) {
// 		console.error("Database error:", error);
// 		return NextResponse.json(
// 			{
// 				confirmation: "fail",
// 				error: "Failed to fetch streamers",
// 			},
// 			{ status: 500 }
// 		);
// 	}
// }






// /api/streamers/[streamerId]/streamer_auth_providers/route.ts
// export async function GET(req: NextRequest, { params }: { params: { streamerId: string } }) {
//     const supabase = createClient();
//     const { data, error } = await supabase
//         .from('streamer_auth_provider')
//         .select('*')
//         .eq('user_id', params.streamerId);
//     if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//     return NextResponse.json(data);
// }

// export async function DELETE(req: NextRequest, { params }: { params: { streamerId: string } }) {
//     const supabase = createClient();
//     const { error } = await supabase.from('streamer_auth_provider').delete().eq('user_id', params.streamerId);
//     if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//     return NextResponse.json({ message: 'Auth providers deleted' });
// }



