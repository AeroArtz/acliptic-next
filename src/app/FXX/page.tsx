import { auth } from "@/auth";
import FXXPage from "@/components/FXX/FXXpage";

export default async function Studio() {

  const session = await auth();
  const user_id = session?.user?.id || ""
  
  return (
    <FXXPage user_id={user_id} />
  )
}