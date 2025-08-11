import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import axios from "axios";
import { db } from "@/db";
import { socialMediaHandle } from "@/db/schema/users";
import { uploadedClip } from "@/db/schema/users";
import { eq, inArray, and } from "drizzle-orm";


type UploadResult = {
	success?: boolean;
	videoId?: string;
	error?: string;
} | null;

interface YouTubeResponse {
	data: {
		id?: string;
		kind?: string;
		snippet?: {
			title?: string;
			description?: string;
			thumbnails?: {
				default?: { url?: string };
				medium?: { url?: string };
				high?: { url?: string };
			};
		};
		status?: {
			privacyStatus?: string;
			uploadStatus?: string;
		};
	};
}

// Define TypeScript interfaces for Instagram API response
interface InstagramMediaItem {
	id: string;
	media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
	permalink: string;
	timestamp: string;
	caption?: string;
	media_url: string;
	thumbnail_url?: string;
	children?: {
		data: Array<{
			id: string;
			media_type: 'IMAGE' | 'VIDEO';
			media_url: string;
		}>;
	};
}

interface InstagramResponse {
  }
  
  interface InstagramMediaResponse {
	data: InstagramMediaItem[];
	paging?: {
	  cursors: {
		before: string;
		after: string;
	  };
	  next?: string;
	};
  }

 async function getMostRecentInstagramPost(): Promise<string | null> {
	// Get access token and business ID from environment variables
	const accessToken = "IGAAYYSV01ATFBZAE9jckE0cXZAiZA2Flbi1FbUljR2tyRkgwQlhDYXk1M1JFRkx3eUZAIMlFOcy1GalBPVE52NUc1dFVYWXMwQ1dLOTNJUFVhZAGdhN2hPY2JfcVNvRkxraHBzQ1gxWHR2RS05ak5TajdTdjh3";
    const businessAccountId = "9614574678593179";

	if (!accessToken || !businessAccountId) {
	  console.log("Missing Instagram credentials in environment variables");
	  return "";
	}
	
	try {
	  // In Next.js 15, fetch defaults to no-store, so we don't need to specify it
	  // but if you want to cache, you can add { cache: 'force-cache' }
	  const response = await fetch(
		`https://graph.instagram.com/v22.0/${businessAccountId}/media?fields=id,media_type,permalink,timestamp,caption,media_url&limit=5&access_token=${accessToken}`
	  );
	  
	  if (!response.ok) {
		console.error(`Instagram API error: ${response.status} ${response.statusText}`);
		return null;
	  }
	  
	  const data = await response.json() as InstagramMediaResponse;
	  
	  if (!data.data || data.data.length === 0) {
		console.log("No Instagram posts found");
		return null;
	  }
	  
	  // Sort by timestamp to ensure we get the most recent post
	  data.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	  
	  // Get the most recent post
	  const mostRecentPost = data.data[0];
	  
	  console.log("- Instagram URL:", mostRecentPost.permalink);
	 
	  return mostRecentPost.permalink;
	  
	} catch (error) {
	  console.error("Error fetching Instagram data:", error instanceof Error ? error.message : String(error));
	  return null;
	}
  }
export async function POST(req: NextRequest) { 
	const { user_id, title, clip_id, description, video_path } = await req.json();
	const uploadResults: { youtube: UploadResult; instagram: UploadResult } = {
		youtube: null,
		instagram: null,
	};

	// Get tokens for both platforms using Drizzle
	try {
		const tokens = await db
			.select({
				platform_id: socialMediaHandle.platform_id,
				access_token: socialMediaHandle.access_token,
				refresh_token: socialMediaHandle.refresh_token,
				token_expires_at: socialMediaHandle.token_expires_at,
				account_user_id: socialMediaHandle.account_user_id,
			})
			.from(socialMediaHandle)
			.where(
				and(
					inArray(socialMediaHandle.platform_id, [701, 703]), // YouTube: 701, Instagram: 703
					eq(socialMediaHandle.user_id, user_id)
				)
			);


		console.log("tokens", tokens);
		console.log("user_id", user_id);

		// Create a map of platform tokens
		const platformTokens = tokens.reduce((acc, token) => {
			acc[token.platform_id] = token;
			return acc;
		}, {} as Record<number, typeof tokens[number]>);

		// Try YouTube upload if token exists
		if (platformTokens[701]) {
			try {
				let accessToken = platformTokens[701].access_token;
				const refreshToken = platformTokens[701].refresh_token;
				const tokenExpiresAt = platformTokens[701].token_expires_at ? new Date(platformTokens[701].token_expires_at) : null;
				const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

				if (tokenExpiresAt && tokenExpiresAt < fiveMinutesFromNow) {
					console.log("token expires")
					try {
						// Create an OAuth2 client for refreshing the token
						const oauth2Client = new google.auth.OAuth2(
							process.env.YOUTUBE_CLIENT_ID,
							process.env.YOUTUBE_CLIENT_SECRET,
							process.env.YOUTUBE_REDIRECT_URI
						);
						
						// Set the refresh token
						oauth2Client.setCredentials({
							refresh_token: refreshToken
						});
						
						// Get a new access token
						const tokenResponse = await oauth2Client.refreshAccessToken();
						const tokens = tokenResponse.credentials;
						console.log(tokens)
						
						// Update the access token in our application
						if (tokens.access_token) {
							const expiryDate = new Date();
							// Add expiry time (default to 1 hour if not provided)
							expiryDate.setSeconds(
								expiryDate.getSeconds() + (tokens.expiry_date ? 
									Math.floor((tokens.expiry_date - Date.now()) / 1000) : 
									3600)
							);
							
							await db
								.update(socialMediaHandle)
								.set({
									access_token: tokens.access_token,
									token_expires_at: expiryDate,
								})
								.where(
									and(
										eq(socialMediaHandle.user_id, user_id),
										eq(socialMediaHandle.platform_id, 701)
									)
								);
						}
					} catch (error) {
						console.error("Failed to refresh token:", error);
						// Delete expired token using Drizzle
						await db
							.delete(socialMediaHandle)
							.where(
								and(
									eq(socialMediaHandle.user_id, user_id),
									eq(socialMediaHandle.platform_id, 701)
								)
							);
						uploadResults.youtube = { error: "Authorization expired" };
					}
				}

				if (accessToken) {
					const oauth2Client = new google.auth.OAuth2();
					oauth2Client.setCredentials({ access_token: accessToken });
					const youtube = google.youtube({
						version: "v3",
						auth: oauth2Client,
					});

					// Create a platform-independent temp directory path
					const tempDir = path.join(process.cwd(), "public", "tmp");

					// Ensure the directory exists
					if (!fs.existsSync(tempDir)) {
						fs.mkdirSync(tempDir, { recursive: true });
					}

					const tempFilePath = path.join(
						tempDir,
						`youtube-upload-${Date.now()}.mp4`
					);

					// Create a write stream for the temporary file
					const writer = fs.createWriteStream(tempFilePath);

					// Download the file
					const response = await axios({
						method: "GET",
						url: video_path,
						responseType: "stream",
					});

					// Pipe the response data to the file
					response.data.pipe(writer);

					// Wait for the download to complete
					await new Promise<void>((resolve, reject) => {
						writer.on("finish", () => resolve());
						writer.on("error", (err: Error) => reject(err));
					});

					// Now upload the downloaded file to YouTube
					const fileStream = fs.createReadStream(tempFilePath);

					const ytResponse = await youtube.videos.insert(
						{
							part: ["snippet", "status"],
							requestBody: {
								snippet: {
									title,
									description,
								},
								status: {
									privacyStatus: "public",
								},
							},
							media: {
								body: fileStream,
							},
						}
					);

					// Clean up the temporary file
					fs.unlinkSync(tempFilePath);

					uploadResults.youtube = {
						success: true,
						videoId: ytResponse.data.id || undefined,
					};
				}
			} catch (error: any) {
				console.error("YouTube upload error:", error);
				if (error.code === 401) {
					await db
						.delete(socialMediaHandle)
						.where(
							and(
								eq(socialMediaHandle.user_id, user_id),
								eq(socialMediaHandle.platform_id, 701)
							)
						);
				}
				uploadResults.youtube = { error: error.message || "Upload failed" };
			}
		}

		// Instagram upload
		if (platformTokens[703]) {
			try {
				// Step 1: Initialize upload session
				const initResponse = await fetch(
					`https://graph.instagram.com/v22.0/${platformTokens[703].account_user_id}/media`,
					{
						method: "POST",
						body: new URLSearchParams({
							media_type: "REELS",
							caption: title,
							video_url: video_path,
						}),
						headers: {
							Authorization: `Bearer ${platformTokens[703].access_token}`,
						},
					}
				);

				// Parse the response
				const rawResponse = await initResponse.text();
				console.log("Raw init response:", rawResponse);

				let responseData;
				try {
					responseData = JSON.parse(rawResponse);
					console.log("Parsed response data:", responseData);
				} catch (e) {
					console.log(e)
					throw new Error(
						`Failed to parse init response: ${rawResponse}`
					);
				}

				const containerId = responseData.id;

				if (!containerId) {
					throw new Error(
						"Failed to initialize upload: Missing container ID"
					);
				}

				console.log("Upload initialized, container ID:", containerId);

				// Step 2: Poll for media status before publishing
				let isMediaReady = false;
				let attempts = 0;
				const maxAttempts = 30; // Maximum number of polling attempts
				const pollInterval = 3000; // Poll every 3 seconds

				while (!isMediaReady && attempts < maxAttempts) {
					attempts++;
					console.log(
						`Checking media status, attempt ${attempts}/${maxAttempts}`
					);

					// Wait before polling
					await new Promise((resolve) =>
						setTimeout(resolve, pollInterval)
					);

					// Check media status
					const statusResponse = await fetch(
						`https://graph.instagram.com/v22.0/${containerId}?fields=status_code`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${platformTokens[703].access_token}`,
							},
						}
					);

					const statusData = await statusResponse.json();
					console.log("Media status:", statusData);

					// If status is FINISHED or PUBLISHED, we can publish
					if (statusData.status_code === "FINISHED") {
						isMediaReady = true;
						break;
					}

					// If there's an error status, stop polling
					if (statusData.status_code === "ERROR") {
						throw new Error(`Media processing failed: ${statusData}`);
					}
				}

				console.log("Media is ready for publishing");

				// Step 3: Publish media once it's ready
				const publishResponse = await fetch(
					`https://graph.instagram.com/v22.0/${platformTokens[703].account_user_id}/media_publish`,
					{
						method: "POST",
						body: new URLSearchParams({ creation_id: containerId }),
						headers: {
							Authorization: `Bearer ${platformTokens[703].access_token}`,
						},
					}
				);

				console.log("Publish Response Status:", publishResponse.status);
				const publishResponseBody = await publishResponse.json();
				console.log("Publish Response Body:", publishResponseBody);

				console.log("INSTA RESULTS ARE HERE")
				console.log(publishResponseBody)

				if (publishResponse.status >= 200 && publishResponse.status < 300) {
					uploadResults.instagram = {
						success: true,
						videoId: publishResponseBody.id || containerId,
					};
				} else {
					throw new Error(
						`Publishing failed: ${JSON.stringify(publishResponseBody)}`
					);
				}
			} catch (error: any) {
				console.error("Instagram upload error:", error);
				uploadResults.instagram = {
					error: error.message || "Upload failed",
				};
			}
		}
	} catch (error) {
		console.error("Error fetching tokens:", error);
		return NextResponse.json(
			{ error: "Failed to fetch tokens" },
			{ status: 500 }
		);
	}

	// Check if both uploads failed
	if (
		(!uploadResults.youtube || uploadResults.youtube.error) &&
		(!uploadResults.instagram || uploadResults.instagram.error)
	) {
		return NextResponse.json(
			{
				error: "All uploads failed",
				details: uploadResults,
			},
			{ status: 500 }
		);
	}

	// INSERT UPLOADED_CLIP RECORD FOR INSTA IF SUCCESSFULLY UPLOADED
	if (uploadResults?.instagram?.success){

		// GET INSTA URL
		const insta_uploaded_URL = await getMostRecentInstagramPost()

		
		const socialMediaHandle_insta = await db.select({
			handle_id: socialMediaHandle.handle_id,
		}).from(socialMediaHandle).where(and(
			eq(socialMediaHandle.user_id,user_id),
			eq(socialMediaHandle.platform_id, 703)
		));
		//const socialMediaHandle_insta  = [{handle_id : "37af70b6-b2d1-4b7d-8c6d-6394534130dc"}]

		console.log("INSTA DATA")
		console.log("clip id: "+clip_id)
		console.log("socialMediaHandle_insta: "+socialMediaHandle_insta[0].handle_id)
		console.log("insta_uploaded_URL: "+insta_uploaded_URL)

		await db.insert(uploadedClip).values({ 
			clip_id: clip_id,
			social_media_handle_id : socialMediaHandle_insta[0].handle_id,
			upload_link : insta_uploaded_URL || "",
			uploaded_at : new Date(Date.now())
		 });


	}

	// INSERT UPLOADED_CLIP RECORD FOR YOUTUBE IF SUCCESSFULLY UPLOADED
	if (uploadResults?.youtube?.success){

		// GET YT URL 
		const yt_uploaded_URL = `https://www.youtube.com/shorts/${uploadResults?.youtube?.videoId}`

		
		const socialMediaHandle_yt = await db.select({
			handle_id: socialMediaHandle.handle_id,
		}).from(socialMediaHandle).where(and(
			eq(socialMediaHandle.user_id,user_id),
			eq(socialMediaHandle.platform_id, 701)
		));
		

		//const socialMediaHandle_yt  = [{handle_id : "d93fcaa9-c8ef-4cc2-bf8b-0a2ea5a113d5"}]

		console.log("YT DATA")
		console.log("clip id: "+clip_id)
		console.log("socialMediaHandle_yt: "+socialMediaHandle_yt[0].handle_id)
		console.log("YT_uploaded_URL: "+yt_uploaded_URL)

		await db.insert(uploadedClip).values({ 
			clip_id: clip_id,
			social_media_handle_id : socialMediaHandle_yt[0].handle_id,
			upload_link : yt_uploaded_URL,
			uploaded_at : new Date(Date.now())
		 });
			
	}

	// Return results of both upload attempts
	return NextResponse.json({
		message: "Upload(s) completed",
		results: uploadResults,
	});
}