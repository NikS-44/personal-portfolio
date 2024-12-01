import React from "react";
import Image from "next/image";
import latencyDemo from "@/app/assets/latency.gif";

const Latency = () => {
  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="relative w-full max-w-[1122px]">
        <div className="flex w-full text-center">
          <div className="flex-1 text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">Before</div>
          <div className="flex-1 text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">After</div>
        </div>
        <Image src={latencyDemo} alt="New Top Navigation" width={1122} height={1245} className="w-full" />
      </div>
    </div>
  );
};

export default Latency;
