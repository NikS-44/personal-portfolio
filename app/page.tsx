import GitHubIcon from "@/app/components/GithubIcon";
import LinkedInIcon from "@/app/components/LinkedInIcon";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <header className="sticky top-0 z-50 w-full bg-black text-white shadow-md">
        <div className="mx-auto flex flex-wrap items-center justify-between p-4 pt-1">
          <nav className="mr-6 flex flex-grow justify-center gap-2 space-x-6 pt-3 font-bold">
            <a href="#about" className="transition-colors duration-300 hover:text-cyan-400">
              About
            </a>
            <a href="#projects" className="transition-colors duration-300 hover:text-cyan-400">
              Projects
            </a>
            <a href="#workHistory" className="transition-colors duration-300 hover:text-cyan-400">
              Skills
            </a>
            <a href="#contact" className="transition-colors duration-300 hover:text-cyan-400">
              Contact
            </a>
          </nav>
          <div className="flex flex-grow flex-row-reverse justify-center gap-2.5 pt-3 font-bold">
            <a
              className="flex items-center gap-2 text-nowrap transition-colors duration-300 hover:text-cyan-400 hover:underline hover:underline-offset-4"
              href="https://www.linkedin.com/in/nik-shah-657ba616/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
              Hire Me!
            </a>
            <a
              className="mr-2 flex items-center gap-2 text-nowrap border-r-2 border-gray-300 pr-3 transition-colors duration-300 hover:text-cyan-400 hover:underline hover:underline-offset-4"
              href="https://github.com/NikS-44/personal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              Source Code
            </a>
          </div>
        </div>
      </header>
      <main className="w-full flex-grow bg-gray-100">
        <section
          id="about"
          className="mx-auto -mt-16 mb-4 flex h-screen max-w-7xl flex-col items-center justify-center gap-6 px-8 pt-16"
        >
          <h1 className="mt-4">About Me</h1>
          <p>
            I have a passion for all things tech and love the challenge of solving complex problems. In my free time,
            you can find me at the climbing gym, in the mountains, or setting up the latest silly home automation. In a
            former life, I was a senior hardware engineer designing server motherboards, but I gave that all up so I
            could build websites!
          </p>
          <p>
            As a frontend developer, I&apos;ve worked professionally with React and Angular, and while I don&apos;t
            favor one or the other, I strongly prefer Typescript in whatever web project I am working on. I excel when
            working on teams with a strong collaborative culture, and I get the most joy working with others. I enjoy
            understanding the low level details of how the web actually works, and my goal is to lead teams in building
            scalable, reliable, and performant websites. I also have a strong passion for web accessibility, and believe
            it is paramount to build inclusive and usable websites for all.
          </p>
        </section>
        <section id="projects" className="flex h-screen flex-col items-center justify-center bg-gray-200 py-16">
          <h1>Projects:</h1>
          <ul className="list-inside list-disc">
            <li>Professional:</li>
            <li>Hobby:</li>
          </ul>
          {/*Ideas: Implement some kind of spyglass that showcases the different projects I worked on at shopbop */}
        </section>
        <section id="workHistory" className="h-screen bg-gray-300 pt-16">
          <h1>Work History</h1>
        </section>
        <section id="contact" className="h-screen bg-gray-400 pt-16">
          <h1>Contact Section</h1>
        </section>
      </main>
    </div>
  );
}
