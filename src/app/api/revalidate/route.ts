import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {

    // Get authenticated user
   
    const body = await request.json()
    const { stream_id, secret } = body

    console.log('streamid : ', stream_id)

    // Verify the secret to ensure only your Python backend can trigger revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    if (!stream_id) {
      return NextResponse.json({ error: "streamId is required" }, { status: 400 })
    }

    // Revalidate the specific stream's clips page
    revalidatePath(`/Studio/stream/${stream_id}/clips`)
 
    // Optional: Also revalidate any related pages
    // revalidatePath(`/dashboard/${streamId}`)

    return NextResponse.json({
      revalidated: true,
      path: `/Studio/stream/${stream_id}/clips`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 })
  }
}