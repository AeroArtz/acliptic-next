interface PodcastInfoProps {
    title: string;
    duration: string;
    uploadDate: string;
  }
  
  export function PodcastInfo({ title, duration, uploadDate }: PodcastInfoProps) {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-start">
          <h2 className="text-[16px] font-normal mr-4 mb-1">{title}</h2>
          <span className="text-[#545454] text-[9px] mr-4">{duration}</span>
        </div>
        <div className="flex items-center">
          <span className="text-black text-[9px] mr-3">Uploaded {uploadDate}</span>
          <button className="border border-[#828282] text-black text-[9px] font-normal py-1 px-2 rounded">
            Go to video
          </button>
        </div>
      </div>
    );
  }
  
  