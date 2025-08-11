import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Linkedin, Facebook, Phone, Mail, Clock, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 sm:mt-28 lg:mt-36 px-4 sm:px-8 lg:px-16 py-8 sm:py-10 lg:py-12 bg-white text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4 text-black" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
        Real-time. Nimble. Remote.
      </h2>
      <p className="text-sm sm:text-base text-[#535A6D] mb-12 sm:mb-16 lg:mb-24 hel-font max-w-2xl mx-auto">
        Revolutionizing live stream content: Empowering creators, amplifying engagement.
      </p>

      <div className="flex justify-center items-center mb-16 sm:mb-20 lg:mb-28">
        <Image
          src="/AElogo2.png"
          alt="Acliptic Logo"
          width={120}
          height={100}
          className="w-24 sm:w-32 lg:w-40 h-auto"
          priority
          quality={100}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-24 mb-12 sm:mb-16 lg:mb-20 text-left">
        <FooterSection
          title="ACLIPTIC"
          items={[
            <Link key="Home" href="/" className="hover:text-[#0000F8]">Home</Link>,
            <Link key="About" href="/About" className="hover:text-[#0000F8]">About Us</Link>,
            <Link key="Features" href="/Features" className="hover:text-[#0000F8]">Features</Link>,
            <Link key="Pricing" href="/Pricing" className="hover:text-[#0000F8]">Pricing</Link>,
            <Link key="FXX" href="/FXX" className="hover:text-[#0000F8]">FXX</Link>,

          ]}
        />
        <FooterSection
          title="PLATFORMS"
          items={[
            <Link key="twitch" href="/platforms/twitch" className="hover:text-[#0000F8]">Twitch</Link>,
            <Link key="youtube" href="/platforms/youtube" className="hover:text-[#0000F8]">YouTube</Link>,
            <Link key="tiktok" href="/platforms/tiktok" className="hover:text-[#0000F8]">TikTok</Link>,
            <Link key="instagram" href="/platforms/instagram" className="hover:text-[#0000F8]">Instagram</Link>
          ]}
        />
        <FooterSection
          title="LEGAL"
          items={[
            // <Link key="terms" href="/legal/terms" className="hover:text-[#0000F8]">Terms of Service</Link>,
            <Link key="privacy" href="/privacy-policy" className="hover:text-[#0000F8]">Privacy Policy</Link>,
            // <Link key="cookies" href="/legal/cookies" className="hover:text-[#0000F8]">Cookie Policy</Link>,
            // <Link key="gdpr" href="/legal/gdpr" className="hover:text-[#0000F8]">GDPR Compliance</Link>
          ]}
        />
        <FooterSection
          title="CONTACT"
          items={[
            <span key="phone" className="flex items-center gap-2 hover:text-[#0000F8]">
              <Phone className="text-black" size={16} /> +971 55 448 1725
            </span>,
            <span key="email" className="flex items-center gap-2 hover:text-[#0000F8]">
              <Mail className="text-black" size={16} /> contact@example.com
            </span>,
            <span key="hours" className="flex items-center gap-2">
              <Clock className="text-black" size={16} /> Monday - Friday <br /> 9:00 AM - 6:00 PM GST
            </span>
          ]}
        />
      </div>

      <div className="w-full sm:w-[80%] lg:w-[60%] mx-auto h-[0.5px] bg-[#E1E2E6] mb-6 sm:mb-8"></div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
        <div className="text-sm text-[#535A6D]">
          © 2024 Acliptic. All rights reserved.
        </div>
        <div className="flex justify-center gap-4 sm:gap-6 text-[#0A142F]">
          {[
            { icon: Twitter, href: "https://twitter.com/acliptic" },
            { icon: Linkedin, href: "https://linkedin.com/company/acliptic" },
            { icon: Facebook, href: "https://facebook.com/acliptic" },
            { icon: Instagram, href: "https://www.instagram.com/acliptic/" },
            { icon: Youtube, href: "https://youtube.com/acliptic" }
          ].map(({ icon: Icon, href }, index) => (
            <Link 
              key={index} 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#0000F8] transition-colors"
              aria-label={Icon.name}
            >
              <Icon size={16} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

interface FooterSectionProps {
  title: string;
  items: React.ReactNode[];
}

function FooterSection({ title, items }: FooterSectionProps) {
  return (
    <div>
      <h3 className="text-sm sm:text-base text-[#000000] mb-3 font-medium">{title}</h3>
      <ul className="text-xs sm:text-sm leading-6 sm:leading-7 text-[#535A6D] hel-font space-y-1">
        {items.map((item, index) => (
          <li key={index} className="transition-colors">{item}</li>
        ))}
      </ul>
    </div>
  );
}

