import { db } from "@/db"
import { users } from "@/db/schema/users"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { user_id, newPresets } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        {
          confirmation: "fail",
          message: "User ID is required",
        },
        { status: 400 },
      )
    }

    if (!newPresets) {
      return NextResponse.json(
        {
          confirmation: "fail",
          message: "New presets data is required",
        },
        { status: 400 },
      )
    }

    await db.update(users).set({ presets: newPresets }).where(eq(users.id, user_id))

    return NextResponse.json(
      {
        confirmation: "success",
        message: "Updated user presets successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating presets:", error)

    return NextResponse.json(
      {
        confirmation: "fail",
        message: "Failed to update user presets",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

