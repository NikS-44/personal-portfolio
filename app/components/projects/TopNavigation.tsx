import React, { useState } from "react";
import { ToggleSwitch } from "@/app/components/ToggleSwitch";

const TopNavigation = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center">
        {isToggled ? (
          <div className="flex flex-1 items-center">New Top Navigation</div>
        ) : (
          <div className="flex flex-1 items-center">Old Top Navigation</div>
        )}
        <ToggleSwitch isToggled={isToggled} setIsToggled={setIsToggled} />
      </div>
    </>
  );
};

export default TopNavigation;
