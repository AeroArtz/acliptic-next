import Navigation from './mainNavigation';
import Footer from './Footer';
import { auth } from '@/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {

  const session = await auth();
  const user_id = session?.user?.id || ""

  return (
    <div className="relative">
     
      <Navigation user_id={user_id}/>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

