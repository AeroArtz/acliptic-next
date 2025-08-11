import { NextResponse } from "next/server";

const INSTAGRAM_BUSINESS_AUTH_URL = "https://www.instagram.com/oauth/authorize";

export async function GET() {
	const params = new URLSearchParams({
		enable_fb_login: "0",
		force_authentication: "1",
		client_id: process.env.INSTAGRAM_APP_ID!,
		redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
		response_type: "code",
		scope: "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights",
	});

	return NextResponse.redirect(
		`${INSTAGRAM_BUSINESS_AUTH_URL}?${params.toString()}`
	);
}
