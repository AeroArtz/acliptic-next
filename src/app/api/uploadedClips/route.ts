import { NextResponse } from "next/server";
import { db } from "@/db";
import { uploadedClip, clip, socialMediaHandle } from "@/db/schema/users";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

//done
const UploadedClipSchema = z.object({
	clip_id: z
		.string({
			required_error: "Clip ID is required",
			invalid_type_error: "Clip ID must be a string",
		})
		.uuid("Clip ID must be a valid UUID"),
	social_media_handle_id: z
		.string({
			required_error: "Social media handle ID is required",
			invalid_type_error: "Social media handle ID must be a string",
		})
		.uuid("Social media handle ID must be a valid UUID"),
	upload_link: z
		.string({
			required_error: "Upload link is required",
			invalid_type_error: "Upload link must be a string",
		})
		.url("Please provide a valid URL for the upload link"),
	uploaded_at: z
		.string({
			required_error: "Upload timestamp is required",
			invalid_type_error: "Upload timestamp must be a string",
		})
		.datetime({
			message: "Please provide a valid ISO timestamp for uploaded_at",
		})
		.optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const body = await request.json();

		// Validate request body
		const uploadedClipResult = UploadedClipSchema.safeParse(body);
		if (!uploadedClipResult.success) {
			const errors = uploadedClipResult.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid uploaded clip data",
					message: errors,
				},
				{ status: 400 }
			);
		}

		const { clip_id, social_media_handle_id, upload_link, uploaded_at } =
			uploadedClipResult.data;

		// Check if clip exists
		const clipExists = await db
			.select()
			.from(clip)
			.where(eq(clip.clip_id, clip_id));

		if (clipExists.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Clip not found",
				},
				{ status: 404 }
			);
		}

		// Check if social media handle exists and is active
		const handleExists = await db
			.select({ handle_id: socialMediaHandle.handle_id })
			.from(socialMediaHandle)
			.where(
				and(eq(socialMediaHandle.handle_id, social_media_handle_id))
			);

		if (handleExists.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Social media handle not found",
				},
				{ status: 404 }
			);
		}

		// Check if this clip is already uploaded to this handle
		// const duplicateExists = await db
		// 	.select()
		// 	.from(uploadedClip)
		// 	.where(
		// 		and(
		// 			eq(uploadedClip.clip_id, clip_id),
		// 			eq(
		// 				uploadedClip.social_media_handle_id,
		// 				social_media_handle_id
		// 			)
		// 		)
		// 	)
		// 	.limit(1);

		// if (duplicateExists.length > 0) {
		// 	return NextResponse.json(
		// 		{
		// 			confirmation: "fail",
		// 			error: "This clip has already been uploaded to this social media handle",
		// 		},
		// 		{ status: 409 }
		// 	);
		// }

		const insertData = {
			clip_id: clip_id,
			social_media_handle_id: social_media_handle_id,
			upload_link: upload_link,
			uploaded_at: uploaded_at ? new Date(uploaded_at) : null,
		};
		// Insert new uploaded clip
		const insertedData = await db
			.insert(uploadedClip)
			.values(insertData)
			.returning();

		return NextResponse.json({
			confirmation: "success",
			message: "Uploaded clip created successfully",
			data: insertedData,
		});
	} catch (error) {
		console.error("Error creating uploaded clip:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to create uploaded clip",
			},
			{ status: 500 }
		);
	}
}
