import React from "react";

export interface Badge {
  text: string;
  icon?: React.ReactNode;
}

export interface BadgesProps {
  badges: Badge[];
}

const Badges = ({ badges }: BadgesProps) => {
  return (
    <section className={"mt-4 flex flex-wrap gap-2"}>
      {badges.map(({ text, icon }) => {
        return (
          <div key={text} className={"flex items-center rounded px-2 py-1 outline outline-1 outline-cyan-200"}>
            {icon}
            <span className="text-[clamp(0.625rem,0.425rem_+_1vw,1rem)]">{text}</span>
          </div>
        );
      })}
    </section>
  );
};

export default Badges;
