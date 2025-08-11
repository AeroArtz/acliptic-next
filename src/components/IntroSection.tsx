"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Partner = {
  name: string;
  logo: string;
  width: number;
  height: number;
};

type IntroSectionProps = {
  title: string;
  backgroundImage: string;
  partners: Partner[];
  missionTitle: string;
  missionContent: string;
};

export default function IntroSection({
  title,
  backgroundImage,
  partners,
  missionTitle,
  missionContent,
}: IntroSectionProps) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);
  return (
    <section className="pb-16">
      <div
        className="block w-full h-[460px] bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full bg-black text-white text-xs py-1.5 text-center opacity-80">
          <p>
            Contact us via email incase of any problems.{" "}
            <Link
              href="/contact"
              className="text-[#0071E3] hover:text-[#339CFF]"
            >
              Email &gt;
            </Link>
          </p>
        </div>
        <p
          className={`text-white text-4xl block text-center mt-32 font-medium transition-all duration-1000 ${
            animate
              ? "translate-y-0 opacity-100"
              : "translate-y-[100px] opacity-0"
          }`}
        >
          {title}
        </p>
      </div>
      <div className="flex justify-center gap-16 mt-16">
        {partners.map((partner, index) => (
          <Image
            key={index}
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={partner.width * 0.8}
            height={partner.height * 0.8}
          />
        ))}
      </div>
      <div className="max-w-3xl mx-auto text-center px-4 py-6 mt-16">
        <h2 className="text-3xl leading-9 mt-0 font-medium">
          {missionTitle}
        </h2>
        <p className="mt-8 text-base leading-6 text-black/60">
          {missionContent}
        </p>
      </div>
    </section>
  );
}