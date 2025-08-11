import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema/users"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const response = await db.select().from(users).where(eq(users.email, email));

    // If response contains a record means user exists
    if (response.length > 0) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user

    await db.insert(users).values({
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

