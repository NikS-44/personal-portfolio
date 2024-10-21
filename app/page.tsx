import GitHubIcon from "@/app/components/GithubIcon";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold text-gray-800">MyPortfolio</div>
          <nav className="flex gap-2 space-x-6">
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
              About
            </a>
            <a href="#projects" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Projects
            </a>
            <a href="#skills" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Skills
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Contact
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700 hover:text-blue-600 transition-colors duration-300"
              href="https://github.com/NikS-44/personal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              Source Code
            </a>
          </nav>
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
