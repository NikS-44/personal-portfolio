import React from "react";
import Image from "next/image";
import portrait from "@/app/assets/portrait.jpg";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";

const Greeting = () => {
  return (
    <>
      <h1 className="text-6xl">Hi, I&apos;m Nik!</h1>
      <div className="relative mx-auto aspect-square w-[300px] overflow-hidden rounded-full">
        <Image src={portrait} alt="Nik's Face" fill className="object-cover" priority />
      </div>
      <p className="mt-5">
        I&#39;m a front-end developer with a passion for all things tech and love the challenge of solving complex
        problems. I enjoy understanding the low level details of how the web actually works, and my goal is to lead
        teams in building scalable, reliable, and performant websites. I also have a strong passion for web
        accessibility, and believe it is paramount to build inclusive and usable websites for all.
      </p>
      <p>
        In my free time, you can find me climbing in the mountains, hanging with my chihuahuas, or annoying my family
        with the latest silly home automation.
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
