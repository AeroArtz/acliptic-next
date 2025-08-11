import Image from 'next/image'
import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  timeAgo: string;
  clips: number;
  uploads: number;
  imageUrl: string;
}

export function ProjectCard({ title, timeAgo, clips, uploads, imageUrl }: ProjectCardProps) {
  return (
    <div className="relative w-[400px]">
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-md px-1.5 py-0.5 text-white text-xs flex items-center">
          <span>3</span>
        </div>
        <Link href="/Studio/clips">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={225}
          className="object-cover w-full aspect-[16/9] rounded-sm"
        />
        </Link>
      </div>
      <div className="mt-3">
        <h3 className="text-[16px] font-normal text-black">{title}</h3>
        <div className="flex items-center gap-2 mt-1 text-[12px] text-[#666666] font-normal">
          <span>streamed {timeAgo}</span>
          <span>•</span>
          <span>{clips} clips</span>
          <span>•</span>
          <span>{uploads} uploads</span>
        </div>
      </div>
    </div>
  );
}

