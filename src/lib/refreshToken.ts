import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

export async function refreshAccessToken(user_id: string) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);

	try {
		const { data, error } = await supabase
			.from("social_media_handle")
			.select("refresh_token")
			.eq("user_id", user_id)
			.eq("platform_id", 701) //refreshes only for youtube
			.single();

		if (error || !data?.refresh_token) {
			throw new Error("No refresh token found");
		}

		const oauth2Client = new google.auth.OAuth2(
			process.env.YOUTUBE_CLIENT_ID!,
			process.env.YOUTUBE_CLIENT_SECRET!,
			process.env.YOUTUBE_REDIRECT_URI!
		);

		oauth2Client.setCredentials({
			refresh_token: data.refresh_token,
		});

		const { credentials } = await oauth2Client.refreshAccessToken();

		// Update with new tokens
		await supabase
			.from("social_media_handle")
			.update({
				access_token: credentials.access_token,
				token_expires_at: new Date(
					credentials.expiry_date!
				).toISOString(),
			})
			.eq("user_id", user_id)
			.eq("platform_id", 701);

		return credentials.access_token;
	} catch (error) {
		console.error("Error refreshing token:", error);
		throw error;
	}
}
