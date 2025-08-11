import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, socialMediaHandle } from "@/db/schema/users";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

//done
// Update UserIdSchema to validate UUID format
const UserIdSchema = z
	.string({
		required_error: "User ID is required",
		invalid_type_error: "User ID must be a string",
	})
	.trim()
	.min(1, "User ID cannot be empty")
	.uuid("User ID must be a valid UUID");

type UserParams = {
	params: {
		streamerId: z.infer<typeof UserIdSchema>;
	};
};

type RevokeResult = {
  success: boolean;
  error: string | null;
};


export async function GET(
	request: Request,
	{ params }: { params: Promise<{ streamerId: string }> }
): Promise<NextResponse> {
	try {
		const { streamerId } = await params;

		// Validate streamerId
		const validationResult = UserIdSchema.safeParse(streamerId);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "Invalid user ID",
					message: validationResult.error.errors[0].message,
				},
				{ status: 400 }
			);
		}

		// Check if user exists
		const userExists = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.id, streamerId));

		if (userExists.length === 0) {
			return NextResponse.json(
				{
					confirmation: "fail",
					error: "User not found",
				},
				{ status: 404 }
			);
		}

		// Fetch social media handles for the user
		const socialMediaHandles = await db
			.select()
			.from(socialMediaHandle)
			.where(eq(socialMediaHandle.user_id, streamerId))
			.orderBy(desc(socialMediaHandle.created_at));

		if (socialMediaHandles.length === 0) {
			return NextResponse.json({
				confirmation: "success",
				message: "No social media handles found for this user",
				data: [],
			});
		}

		const platformMap: Record<number, 'youtube' | 'instagram'> = {
			701: 'youtube',
			703: 'instagram'
		};

		const mappedHandles = socialMediaHandles.map(handle => ({
		...handle,
		platform: platformMap[handle.platform_id] || 'unknown'
		}));


		return NextResponse.json({
			confirmation: "success",
			data: mappedHandles,
		});
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to fetch social media handles for the user",
			},
			{ status: 500 }
		);
	}
}


// ✅ Internal utility function for YouTube token revocation
async function revokeYouTubeAccess(accessToken: string): Promise<RevokeResult> {
  console.log('🚀 Starting YouTube access revocation...');
  
  try {
    if (!accessToken) {
      console.log('⚠️ No access token provided, treating as success');
      return { success: true, error: null };
    }

    const revokeResponse = await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (revokeResponse.ok || revokeResponse.status === 400) {
      return { success: true, error: null };
    } else {
      const errorText = await revokeResponse.text();
      return {
        success: false,
        error: `YouTube revocation failed with status ${revokeResponse.status}: ${errorText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `YouTube revocation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// ✅ Main DELETE handler
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ streamerId: string }> }
): Promise<NextResponse> {
  try {
    const { streamerId } = await params;

    const validationResult = UserIdSchema.safeParse(streamerId);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          confirmation: "fail",
          error: "Invalid user ID",
          message: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const platform = url.searchParams.get('platform');
    if (!platform) {
      return NextResponse.json(
        { confirmation: "fail", error: "Platform parameter is required" },
        { status: 400 }
      );
    }

    const platformMap: { [key: string]: number } = {
      youtube: 701,
      instagram: 703,
    };

    const platformId = platformMap[platform.toLowerCase()];
    if (!platformId) {
      return NextResponse.json(
        { confirmation: "fail", error: "Invalid platform" },
        { status: 400 }
      );
    }

    const existingConnection = await db
      .select()
      .from(socialMediaHandle)
      .where(
        and(
          eq(socialMediaHandle.user_id, streamerId),
          eq(socialMediaHandle.platform_id, platformId)
        )
      )
      .limit(1);

    if (existingConnection.length === 0) {
      return NextResponse.json(
        { confirmation: "fail", error: "No connection found to delete" },
        { status: 404 }
      );
    }

    const connection = existingConnection[0];
    let revocationResult: RevokeResult = { success: false, error: null };

	// Revoke access token based on platform using modularized functions
	if (platform.toLowerCase() === 'youtube') {
		revocationResult = await revokeYouTubeAccess(connection.access_token);
	} else if (platform.toLowerCase() === 'instagram') {
		// no current deauthorize method exists
	}

    // 🧹 Delete connection regardless of revocation success
    const deletedHandle = await db
      .delete(socialMediaHandle)
      .where(
        and(
          eq(socialMediaHandle.user_id, streamerId),
          eq(socialMediaHandle.platform_id, platformId)
        )
      )
      .returning();

    let message = "Connection deleted successfully";
    if (revocationResult.success) {
      message += ` and ${platform} access revoked`;
    } else if (revocationResult.error) {
      message += `, but failed to revoke ${platform} access`;
    }

    return NextResponse.json({
      confirmation: "success",
      message,
      data: {
        deleted_connection: deletedHandle[0],
        access_revoked: revocationResult.success,
        revocation_error: revocationResult.error,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting social media handle:", error);
    return NextResponse.json(
      {
        confirmation: "fail",
        error: "Failed to delete social media handle",
      },
      { status: 500 }
    );
  }
}
