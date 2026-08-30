import Link from "next/link";
import GitHubIcon from "@/app/components/icons/GithubIcon";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nik-shah-657ba616/",
    icon: <LinkedInIcon />,
  },
  { label: "GitHub", href: "https://github.com/NikS-44/", icon: <GitHubIcon /> },
];

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="t-heading text-lg text-ink">Nik Shah</p>
            <p className="mt-1.5 text-[0.9375rem] text-ink-2">Design systems engineer</p>
            <p className="mt-3 text-sm text-ink-3">Fort Collins, Colorado · US Citizen</p>
          </div>

          <ul className="flex gap-6 sm:flex-col sm:gap-2.5">
            {LINKS.map(({ label, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-ink-2 transition-colors hover:text-copper"
                >
                  {icon}
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-rule pt-5">
          <Link href="/upkeepa" className="text-sm text-ink-3 transition-colors hover:text-copper">
            Also building Upkeepa for iOS
          </Link>
        </div>
      </div>
    </footer>
  );
}
