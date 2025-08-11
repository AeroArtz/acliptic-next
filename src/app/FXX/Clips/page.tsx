import { auth } from "@/auth";
import FXXClipsPage from "@/components/FXX/FXXClipsPage";

export default async function Studio() {

  const session = await auth();
  const user_id = session?.user?.id || ""
  
  return (
    <FXXClipsPage user_id={user_id} />
  )
}