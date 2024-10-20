import GitHubIcon from "@/app/components/GithubIcon";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>Welcome to my portfolio site</header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/NikS-44/personal-portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
          Source Code
        </a>
      </footer>
    </div>
  );
}
