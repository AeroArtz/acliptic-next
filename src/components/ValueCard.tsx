type ValueCardProps = {
    footer: string;
    content: string;
  };
  
  export default function ValueCard({ footer, content }: ValueCardProps) {
    return (
      <div className="flex flex-col justify-center items-center gap-8">
        <div className="flex justify-center items-center text-black/60 h-48 w-48 rounded-full border border-[#D2D2D7]">
          <p className="text-center text-[12px] px-6">{content}</p>
        </div>
        <h3 className="m-0 text-lg leading-6 font-medium">
          {footer}
        </h3>
      </div>
    );
  }