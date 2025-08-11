interface HashtagsProps {
    tags: string[];
  }
  
  export function Hashtags({ tags }: HashtagsProps) {
    return (
      <div className="flex gap-4 mb-6">
        {tags.map((tag, index) => (
          <span key={index} className="bg-[#F6F6F6] text-[#545454] rounded-full px-3 py-1 text-[9px]">
            #{tag}
          </span>
        ))}
      </div>
    );
  }
  
  