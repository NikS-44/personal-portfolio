import React from "react";

interface ToggleSwitchProps {
  isToggled: boolean;
  setIsToggled: (newIsToggled: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isToggled, setIsToggled }) => {
  return (
    <label className="my-2 inline-flex cursor-pointer items-center">
      <input onChange={() => setIsToggled(!isToggled)} type="checkbox" className="peer sr-only" checked={isToggled} />
      <span className="mr-4">Before</span>
      <div className="peer relative h-6 w-11 rounded-full bg-gray-600 text-left after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-gray-300 rtl:peer-checked:after:-translate-x-full"></div>
      <span className="ml-4">After</span>
    </label>
  );
};
