import FeaturesContent from '@/components/Features/FeaturesContent';
import { auth } from "@/auth";

export default async function Features() {
  const session = await auth();
  const user_id = session?.user?.id || ""

  return <FeaturesContent user_id={user_id} />;
}

