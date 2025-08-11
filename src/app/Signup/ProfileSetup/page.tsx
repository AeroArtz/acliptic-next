import { auth } from "@/auth";
import ProfileSetupPage from "@/components/ProfileSetup/ProfileSetupPage";


export default async function ProfileSetup() {

  const session = await auth();
  const user_id = session?.user?.id || ""

  return (
    <ProfileSetupPage user_id={user_id}/>
  )
}