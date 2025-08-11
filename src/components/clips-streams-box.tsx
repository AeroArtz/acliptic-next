// export function ClipsStreamsBox() {
//     return (
//       <div className="w-[350px] h-[208px] bg-[#F6F6F8] rounded-[14px] p-5 pl-[30px] flex flex-col font-['SF_Pro_Display']">
//         <div className="flex flex-col justify-center leading-[1.6]">
//           <span className="font-normal text-[18px] text-black mb-[3px]">Current number of clips.</span>
//           <span className="font-light text-[10px] text-[#666666]">
//             Number of clips generated from initiated streams.
//           </span>
//         </div>
//         <div className="w-full h-[1px] bg-[#CCCCCC] mt-2" />
//         <div className="flex items-center mt-[10px]">
//           <div className="w-1/2 bg-white p-[10px] rounded-lg text-center h-[100px]">
//             <div className="font-normal text-[26px] text-black pt-3">10</div>
//             <div className="font-light text-[12px] text-black">Clips</div>
//           </div>
//           <div className="ml-4" />
//           <div className="w-1/2 p-[10px] pt-[15px] rounded-lg text-center">
//             <div className="font-normal text-[26px] text-black">5</div>
//             <div className="font-light text-[12px] text-black">Streams</div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
import CountUp from "./CountUp";

export function ClipsStreamsBox() {
    return (
      <div className="w-[350px] h-[208px] bg-[#F6F6F8] rounded-[14px] p-5 pl-[30px] flex flex-col font-['SF_Pro_Display']">
        <div className="flex flex-col justify-center leading-[1.6]">
          <span className="font-normal text-[18px] text-black mb-[3px]">Current number of clips.</span>
          <span className="font-light text-[10px] text-[#666666]">
            Number of clips generated from initiated streams.
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#CCCCCC] mt-2" />
        <div className="flex items-center mt-[10px]">
          <div className="w-1/2 bg-white p-[10px] rounded-lg text-center h-[100px]">
            <CountUp 
              from={0}
              to={10}
              separator=","
              direction="up"
              duration={1}
              className="font-normal text-[26px] text-black mt-3 block"
            />
            <div className="font-light text-[12px] text-black">Clips</div>
          </div>
          <div className="ml-4" />
          <div className="w-1/2 p-[10px] pt-[15px] rounded-lg text-center">
            <CountUp 
              from={0}
              to={5}
              separator=","
              direction="up"
              duration={1}
              className="font-normal text-[26px] text-black block"
            />
            <div className="font-light text-[12px] text-black">Streams</div>
          </div>
        </div>
      </div>
    );
  }