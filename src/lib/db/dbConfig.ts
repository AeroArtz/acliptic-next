import { Pool } from "pg";
if (!process.env.DATABASE_URL) {
	throw new Error("Please add DATABASE_URL to your .env file");
}

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
