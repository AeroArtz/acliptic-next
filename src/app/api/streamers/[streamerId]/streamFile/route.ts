import { NextResponse } from "next/server";
import twitch from "twitch-m3u8";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

interface StreamResponse {
	quality: string;
	resolution: string;
	url: string;
}

//not needed
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const streamerUsername = body.streamer;

		if (!streamerUsername) {
			return new NextResponse("Missing streamer parameter", {
				status: 400,
			});
		}

		console.log(`Fetching Twitch stream for: ${streamerUsername}`);

		const stream = await twitch.getStream(streamerUsername);
		if (!stream || !stream.url) {
			return new NextResponse("No active stream found", { status: 404 });
		}

		const m3u8Url = stream.url;
		console.log(`M3U8 URL: ${m3u8Url}`);

		// Define output file path with TS format instead of MP4
		const outputFilePath = path.join(
			process.cwd(),
			"public/streams",
			`${streamerUsername}.ts`
		);

		// Ensure no previous file exists
		if (fs.existsSync(outputFilePath)) {
			fs.unlinkSync(outputFilePath);
		}

		// Modified FFmpeg command
		const ffmpeg = spawn("ffmpeg", [
			"-protocol_whitelist",
			"file,http,https,tcp,tls,crypto", // Added crypto
			"-reconnect",
			"1",
			"-reconnect_streamed",
			"1",
			"-reconnect_delay_max",
			"5",
			"-i",
			m3u8Url,
			"-c",
			"copy", // Copy both video and audio without re-encoding
			"-f",
			"mpegts", // Use MPEG-TS format instead of MP4
			"-y",
			outputFilePath,
		]);

		// Add error handling for spawn failure
		ffmpeg.on("error", (err) => {
			console.error("Failed to start FFmpeg process:", err);
		});

		ffmpeg.stdout.on("data", (data) => console.log(`FFmpeg: ${data}`));
		ffmpeg.stderr.on("data", (data) => console.log(`FFmpeg Log: ${data}`)); // Changed to Log instead of Error

		ffmpeg.on("close", (code) => {
			if (code === 0) {
				console.log(`Download complete: ${outputFilePath}`);
			} else {
				console.error(`FFmpeg exited with code ${code}`);
			}
		});

		return new NextResponse(`Downloading stream for ${streamerUsername}`, {
			status: 200,
		});
	} catch (err) {
		console.error("Error:", err);
		return new NextResponse("Error processing download", { status: 500 });
	}
}

//THE OUTPUT IS A TS FILE FOR NOW
