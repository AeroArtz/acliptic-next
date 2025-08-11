interface StatBoxProps {
    label: string;
    value: string;
    change: {
      value: string;
      isPositive: boolean;
    };
  }
  
  export function StatBox({ label, value, change }: StatBoxProps) {
    return (
      <div className="w-[185px] h-[130px] bg-[#F6F6F8] rounded-[14px] p-5 pl-[30px] flex flex-col font-['SF_Pro_Display']">
        <span className="font-normal text-[14px] text-[#666666] mb-[5px]">{label}</span>
        <div className="flex flex-col justify-center leading-[1.6]">
          <span className="font-normal text-[30px] text-black mb-[3px]">{value}</span>
          <div className="flex items-center">
            <div className="flex items-center mr-[5px]">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[3px]"
              >
                <path
                  d={change.isPositive
                    ? "M7 17L17 7M17 7H8M17 7V16"
                    : "M7 7L17 17M17 17H8M17 17V8"}
                  stroke={change.isPositive ? "#27AE60" : "#EB5757"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={`font-normal text-[10px] ${
                  change.isPositive ? "text-[#27AE60]" : "text-[#EB5757]"
                }`}
              >
                {change.value}
              </span>
            </div>
            <span className="font-light text-[10px] text-black">since last week</span>
          </div>
        </div>
      </div>
    );
  }
  
  