export function UpgradeBox() {
    return (
      <div
  className="w-[225px] h-[208px] rounded-[14px] p-5 pl-[30px] flex flex-col justify-between font-['SF_Pro_Display']"
  style={{
    background: 'linear-gradient(to top right, #69BFF9, #B96AF3, #E9685E, #F2AC3E)',
  }}
>
        <div className="flex flex-col justify-center leading-[1.6] flex-grow">
          <span className="font-normal text-[18px] text-white mb-[3px]">
            Upgrade your <br /> plan.
          </span>
          <span className="font-light text-[10px] text-white mb-[30px]">
            Upgrade your plan to SideEffect Plus or SideEffect Pro to get more features.
          </span>
        </div>
        <div className="w-full flex justify-center mb-0">
          <button className="bg-white text-[#333] rounded-[25px] py-[10px] text-[10px] w-[calc(100%-40px)] cursor-pointer">
            Upgrade
          </button>
        </div>
      </div>
    );
  }
  
  