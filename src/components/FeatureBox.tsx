import Image from "next/image";

interface FeatureBoxProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    className?: string;
    imageClassName?: string;
  }
  
  export default function FeatureBox({
    title,
    description,
    imageSrc,
    imageAlt,
    className = '',
    imageClassName = '',
  }: FeatureBoxProps) {
    return (
      <div className={`bg-[#F5F5F7] rounded-[18px] relative ${className}`}>
        <div className="absolute top-14 left-16 right-12">
          <h3 className="text-5xl font-medium text-black mb-4" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>{title}</h3>
          <p className="text-[16px] text-black hel-font">{description}</p>
        </div>
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className={`w-full h-full object-cover rounded-[18px] ${imageClassName}`}
        />
      </div>
    );
  }
  
  