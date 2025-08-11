// app/api/twitch-thumbnail/route.ts
import { NextRequest, NextResponse } from "next/server";


// Get credentials from environment variables
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

// Auth token caching
let authToken: string | null = null;
let tokenExpiry: number | null = null;

interface TwitchAuthResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

interface TwitchStreamData {
	data: Array<{
		id: string;
		user_id: string;
		user_login: string;
		user_name: string;
		game_id: string;
		game_name: string;
		type: string;
		title: string;
		viewer_count: number;
		started_at: string;
		language: string;
		thumbnail_url: string;
		tag_ids: string[];
		is_mature: boolean;
	}>;
	pagination: {
		cursor?: string;
	};
}

interface ThumbnailResponse {
	isLive: boolean;
	title?: string;
	thumbnail_url?: string;
	error?: string;
	details?: string;
}

//not needed
async function getTwitchAuthToken(): Promise<string> {
	// Return cached token if still valid
	if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
		return authToken;
	}

	if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
		throw new Error("Twitch API credentials not configured");
	}

	try {
		const response = await fetch(
			`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
			{
				method: "POST",
			}
		);

		const data = (await response.json()) as TwitchAuthResponse;

		if (!response.ok) {
			throw new Error("Failed to get Twitch auth token");
		}

		// Cache the token with 60 second safety buffer
		authToken = data.access_token;
		tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

		return authToken;
	} catch (error) {
		console.error("Error getting Twitch auth token:", error);
		throw error;
	}
}

export async function GET(
	request: NextRequest
): Promise<NextResponse<ThumbnailResponse>> {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username");

	if (!username) {
		return NextResponse.json(
			{
				isLive: false,
				error: "Username parameter is required",
			},
			{ status: 400 }
		);
	}

	try {
		// Get auth token
		const token = await getTwitchAuthToken();

		if (!TWITCH_CLIENT_ID) {
			throw new Error("Twitch Client ID not configured");
		}

		// Get stream data directly by username
		const streamResponse = await fetch(
			`https://api.twitch.tv/helix/streams?user_login=${username}`,
			{
				headers: {
					"Client-ID": TWITCH_CLIENT_ID,
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const streamData = (await streamResponse.json()) as TwitchStreamData;

		// Check if stream is live
		if (!streamData.data || streamData.data.length === 0) {
			return NextResponse.json(
				{
					isLive: false,
					error: "Stream not found or not currently live",
				},
				{ status: 404 }
			);
		}

		// Format thumbnail URL (replace template variables)
		const thumbnailUrl = streamData.data[0].thumbnail_url
			.replace("{width}", "640")
			.replace("{height}", "360");

		// Return only the necessary data
		return NextResponse.json({
			isLive: true,
			title: streamData.data[0].title,
			thumbnail_url: thumbnailUrl,
		});
	} catch (error) {
		const err = error as Error;
		console.error("Error fetching Twitch stream data:", err);
		return NextResponse.json(
			{
				isLive: false,
				error: "Failed to fetch stream data",
				details: err.message,
			},
			{ status: 500 }
		);
	}
}
