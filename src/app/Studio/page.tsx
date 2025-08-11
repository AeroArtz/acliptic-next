import { auth } from "@/auth";
import StudioPage from "@/components/Studio/StudioPage";
import { db } from "@/db";
import { stream, users } from "@/db/schema/users";
import { eq, sql } from "drizzle-orm";

export default async function Studio() {

  const session = await auth();
  const user_id = session?.user?.id || "" 
 
  let twitch_username = ""
  let youtube_channel_id = ""


  if (session?.user) {
    const result = await db.select().from(users).where(eq(users.id, user_id))
    if (result.length > 0) {
      twitch_username = result[0]?.username || ""
      youtube_channel_id = result[0]?.youtube_channel_id || ""
    }
  }

  //console.log(session)

  
  return (
    <StudioPage user_id={user_id} twitch_username={twitch_username} youtube_channel_id={youtube_channel_id}/>
  )
}