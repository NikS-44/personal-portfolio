import React from "react";
import Image from "next/image";
import portrait from "@/app/assets/portrait.jpg";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";

const Greeting = () => {
  return (
    <>
      <h1 className="text-[clamp(1.75rem,0.25rem_+_3.75vw,3.75rem)]">Hi, I&apos;m Nik!</h1>
      <div className="relative mx-auto aspect-square w-[calc(100px+((100vw-300px)*0.427))] min-w-32 overflow-hidden rounded-full md:w-[300px]">
        <Image src={portrait} alt="Nik's Face" fill className="object-cover" priority />
      </div>

      <p className="mt-5">
        I&#39;m a front-end developer and hardware engineer with a passion for all things tech! I love the challenge of
        solving complex problems and enjoy understanding the low level details of how the web actually works. My goal is
        to lead teams in building scalable, reliable, and performant websites. I also have a strong passion for web
        accessibility, and believe it is paramount to build inclusive and usable websites for all.
      </p>
      <p>
        In my free time, you can find me climbing in the mountains, hanging with my chihuahuas, proselytizing about
        bidets, or annoying my family with my latest silly home automation.
      </p>
      <div className="flex gap-4">
        <div className="relative rounded-lg border-2 border-cyan-800 text-white transition-colors hover:border-cyan-600">
          <a
            className="relative flex animate-[moving-cyan-black_3s_linear_infinite] items-center gap-2 text-nowrap rounded-md bg-[length:200%_200%] px-4 py-2 transition-colors duration-300"
            href="https://www.linkedin.com/in/nik-shah-657ba616/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            Hire Me!
          </a>
        </div>
        <div className="relative rounded-lg border-2 border-cyan-800 text-white transition-colors hover:border-cyan-600">
          <a
            className="relative flex animate-[moving-cyan-black_3s_linear_infinite] items-center gap-2 text-nowrap rounded-md bg-[length:200%_200%] px-4 py-2 transition-colors duration-300"
            href="#resume"
            rel="noopener noreferrer"
          >
            My Work
          </a>
        </div>
      </div>
    </>
  );
};

export default Greeting;
