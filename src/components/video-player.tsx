export function VideoPlayer() {
  return (
    <div className="w-[173px] h-[260px] rounded-2xl overflow-hidden ml-5 -mt-[45px]">
      <video
        src="/dashvid2.mp4"
        controls
        className="w-full h-full object-cover rounded-2xl"
      ></video>
    </div>
  );
}

