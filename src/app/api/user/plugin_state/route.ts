import { NextResponse } from "next/server"
import { db } from "@/db"
import { stream, users } from "@/db/schema/users"
import { eq, sql } from "drizzle-orm"

export async function POST(request: Request) {
    const { user_id } = await request.json()

    try {
        const res = await db.execute(sql`SELECT * FROM ${stream} WHERE ${stream.user_id} = ${user_id} AND ${stream.active}=TRUE`)
        if (res.rows.length <= 0) {
            console.log('No active streams')
            return NextResponse.json({ message: "Found plugin state", data: {plugin_active : false} }, { status: 200 })
        }
        console.log('YES active streams')
        return NextResponse.json({ message: "Found plugin state", data: {plugin_active : true} }, { status: 200 })

    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
      }
    }
    