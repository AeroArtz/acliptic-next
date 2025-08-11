import { SessionProvider } from "next-auth/react"
import StudioClipsPageComponent from "@/components/Studio/StudioClipsPage"

interface StudioClipsPageProps {
  params: Promise<{
    stream_id: string
  }>
}

export default async function StudioClipsPage({ params }: StudioClipsPageProps) {
  const { stream_id } = await params

  return (
    <SessionProvider>
      <StudioClipsPageComponent stream_id={stream_id} />
    </SessionProvider>
  )
}
