import { db } from "@/db"
import { users } from "@/db/schema/users"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { user_id } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        {
          confirmation: "fail",
          message: "User ID is required",
        },
        { status: 400 },
      )
    }

    const result = await db.select().from(users).where(eq(users.id, user_id))

    if (!result.length) {
      return NextResponse.json(
        {
          confirmation: "fail",
          message: "User not found",
        },
        { status: 404 },
      )
    }

    const presets = result[0]?.presets

    return NextResponse.json(
      {
        confirmation: "success",
        message: "Fetched user presets successfully",
        data: presets,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching presets:", error)

    return NextResponse.json(
      {
        confirmation: "fail",
        message: "Failed to fetch user presets",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

