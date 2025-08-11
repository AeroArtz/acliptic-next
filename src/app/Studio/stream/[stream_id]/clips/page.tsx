// src/app/Studio/stream/[streamIndex]/clips/page.tsx
import { SessionProvider } from "next-auth/react";
import StudioClipsPageComponent from '@/components/Studio/StudioClipsPage'

  interface StudioClipsPageProps {
    params: {
      stream_id: string;
    };
  }
export default function StudioClipsPage({ params } : StudioClipsPageProps) {

  const { stream_id } = params   

  return (
    <SessionProvider>
      <StudioClipsPageComponent stream_id = {stream_id}/>
    </SessionProvider>
  );
}
