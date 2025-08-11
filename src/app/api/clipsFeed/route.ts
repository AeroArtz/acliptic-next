import { NextResponse } from "next/server";
import { db } from "@/db"; // Import your Drizzle client
import { sql } from "drizzle-orm";
import {
	clip,
	stream,
	users,
	clipLike,
	clipComment,
	clipSave,
} from "@/db/schema/users"; // Import the schema tables

// You might want to use auth to get real user ID
//try moving
//done

const TEMP_USER_ID = "101"; // Temporary hardcoded user ID

export async function GET() {
	try {
		// Using Drizzle's SQL template literals for complex queries
		const result = await db.execute(sql`
      WITH clip_stats AS (
        SELECT 
          c.clip_id,
          COUNT(DISTINCT cl.like_id) AS likes_count,
          COUNT(DISTINCT cc.comment_id) AS comments_count,
          COUNT(DISTINCT cs.save_id) AS saves_count,
          EXISTS(
            SELECT 1 FROM ${clipSave} 
            WHERE ${clipSave.clip_id} = c.clip_id 
            AND ${clipSave.user_id} = ${TEMP_USER_ID}
          ) AS is_saved,
          EXISTS(
            SELECT 1 FROM ${clipLike} 
            WHERE ${clipLike.clip_id} = c.clip_id 
            AND ${clipLike.user_id} = ${TEMP_USER_ID}
          ) AS is_liked
        FROM ${clip} c
        LEFT JOIN ${clipLike} cl ON c.clip_id = cl.clip_id
        LEFT JOIN ${clipComment} cc ON c.clip_id = cc.clip_id
        LEFT JOIN ${clipSave} cs ON c.clip_id = cs.clip_id
        GROUP BY c.clip_id
      )
      SELECT 
        c.clip_id,
        c.clip_link,
        s.stream_title AS title,
        u.name AS streamer_name,
        cs.likes_count,
        cs.comments_count,
        cs.saves_count,
        cs.is_saved,
        cs.is_liked
      FROM ${clip} c
      JOIN clip_stats cs ON c.clip_id = cs.clip_id
      JOIN ${stream} s ON c.stream_id = s.stream_id
      JOIN ${users} u ON s.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 20
    `);

		return NextResponse.json({
			confirmation: "success",
			data: result.rows,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				confirmation: "fail",
				error: "Failed to fetch clips feed",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
