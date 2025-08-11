import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DialogContentType {
  title: string;
  content: React.ReactNode; // Now accepts any React content
}

interface FeatureCardProps {
  title: string;
  subtitle: string;
  image?: string;
  isGradient?: boolean;
  gradientColors?: string[];
  children?: React.ReactNode;
  dialogContent: DialogContentType;
}

const FeatureCard = ({
  title,
  subtitle,
  image,
  isGradient = false,
  gradientColors,
  children,
  dialogContent,
}: FeatureCardProps) => {
  return (
    <Dialog>
      <div className="relative w-[400px] h-[670px] rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        {!isGradient && image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        )}
        <div className={`absolute inset-0 ${
          isGradient 
            ? `bg-gradient-to-tr ${gradientColors?.join(' ')}`
            : 'bg-black/30'
        } p-6`}>
          <span className="text-[14px] font-medium text-white tracking-wider">
            {title}
          </span>
          <h3 className="font-medium text-white mt-1 text-[21px]">
            {subtitle}
          </h3>
          {children}
        </div>

        <DialogTrigger asChild>
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-[#333335] flex items-center justify-center cursor-pointer hover:bg-[#444446] transition-colors">
            <Plus className="w-4 h-4 text-white" />
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-[1200px] w-[90vw] h-[90vh]  overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-5xl font-medium">{dialogContent.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {dialogContent.content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureCard;