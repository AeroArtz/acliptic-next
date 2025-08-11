import { auth } from "@/auth";
import MainPage from "@/components/main/MainPage";


export default async function Studio() {

  const session = await auth();
  const user_id = session?.user?.id || ""

  console.log(session)
  
  return (
    <MainPage user_id={user_id} />
  )
}