import { auth } from "@/auth";
import AboutPage from "@/components/About/AboutPage";

export default async function Studio() {

  const session = await auth();
  const user_id = session?.user?.id || ""
  
  return (
	<AboutPage user_id={user_id} />
  )
}