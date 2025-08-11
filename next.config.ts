import type { NextConfig } from "next";
import { createServer } from "https";
import { readFileSync } from "fs";
import path from "path";

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			net: false,
			tls: false,
		};
		return config;
	},
	// server: {
	// 	https:
	// 		process.env.NODE_ENV === "development"
	// 			? {
	// 					key: readFileSync("./certificates/key.pem"),
	// 					cert: readFileSync("./certificates/cert.pem"),
	// 			  }
	// 			: undefined,
	// },
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'static-cdn.jtvnw.net',
			'example.com',
			'storage.googleapis.com', // Add Google storage domain
			'googleapis.com',
			'www.googleapis.com',	  
			'i.ytimg.com'
			// Add your Supabase storage domain if needed
		],
	},
};

export default nextConfig;