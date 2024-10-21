import GitHubIcon from "@/app/components/GithubIcon";
import LinkedInIcon from "@/app/components/LinkedInIcon";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh font-[family-name:var(--font-geist-sans)]">
      <header className="bg-black text-white shadow-md sticky top-0 z-50 w-full">
        <div className="mx-auto flex justify-between items-center p-4 pt-1 flex-wrap max-w-7xl">
          <nav className="font-bold flex gap-2 space-x-6 pt-3 mr-6">
            <a href="#about" className="hover:text-cyan-400 transition-colors duration-300">
              About
            </a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors duration-300">
              Projects
            </a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors duration-300">
              Skills
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors duration-300">
              Contact
            </a>
          </nav>
          <div className="font-bold pt-3 flex">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-cyan-400 transition-colors duration-300 text-nowrap mr-3 pr-3 border-r-2 border-gray-300"
              href="https://www.linkedin.com/in/nik-shah-657ba616/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
              Hire Me!
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-cyan-400 transition-colors duration-300 text-nowrap"
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
      <main className="flex-grow w-full">
        <section id="about" className="h-screen bg-gray-100 pt-16 -mt-16">
          <h1>About Section</h1>
        </section>
        <section id="projects" className="h-screen bg-gray-200 pt-16">
          <h1>Projects Section</h1>
        </section>
        <section id="skills" className="h-screen bg-gray-300 pt-16">
          <h1>Skills Section</h1>
        </section>
        <section id="contact" className="h-screen bg-gray-400 pt-16">
          <h1>Contact Section</h1>
        </section>
      </main>
    </div>
  );
}
