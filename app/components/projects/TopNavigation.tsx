import React, { useState } from "react";
import { ToggleSwitch } from "@/app/components/ToggleSwitch";
import oldTopNav from "../../assets/old-top-nav.gif";
import newTopNav from "../../assets/new-top-nav.gif";
import Image from "next/image";

const TopNavigation = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <div className="flex h-full flex-col items-center">
        {isToggled ? (
          <>
            <div className="flex flex-1 items-center py-2">
              New React Top Navigation on &nbsp;
              <a className="underline" href={"https://www.shopbop.com"}>
                shopbop.com
              </a>
            </div>
            <Image src={newTopNav} alt="New Top Navigation" width={1551} height={811} />
          </>
        ) : (
          <>
            <div className="flex h-full flex-1 items-center py-2">Legacy Vanilla JS Top Navigation</div>
            <Image src={oldTopNav} alt="Old Top Navigation" width={1551} height={811} />
          </>
        )}
        <ToggleSwitch isToggled={isToggled} setIsToggled={setIsToggled} />
      </div>
    </>
  );
};

export default TopNavigation;
