import Image from "next/image";
import Link from "next/link";
import portrait from "@/app/assets/portrait.jpg";
import Reveal from "@/app/components/Reveal";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";

const NOW = [
  { label: "Samsara", detail: "Design systems, web & mobile", href: "#samsara" },
  { label: "Upkeepa", detail: "iOS planner, on the App Store", href: "/upkeepa" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-rule">
      {/* Drafting sheet: a hairline grid and one warm light source. */}
      <div aria-hidden className="sheet-grid pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 8% 0%, rgba(208,134,80,0.13) 0%, rgba(208,134,80,0) 60%)," +
            "linear-gradient(180deg, rgba(14,19,21,0) 40%, var(--ground) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <div>
            <Reveal>
              <h1>
                <span className="t-display block text-balance text-[clamp(1.9rem,4.2vw,3.15rem)] text-ink">
                  I build design systems.
                </span>
                <span className="mt-3 block text-balance font-body text-[clamp(1.05rem,2.1vw,1.5rem)] italic leading-[1.35] text-ink-2">
                  I used to build the hardware they run on.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-6 max-w-[54ch] text-pretty leading-[1.7] text-ink-2">
                I spent ten years designing server hardware before I moved to the frontend. I wanted to be closer to the
                people using what I build, instead of sitting a few layers underneath them. Now I work on design
                systems: components, tokens, and mostly the plumbing that gets teams to actually adopt them.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#experience"
                  className="inline-flex items-center gap-2.5 rounded-sm bg-copper px-5 py-3 font-display text-sm font-semibold tracking-tight text-[#1a0f06] transition-colors hover:bg-copper-2"
                >
                  See the work
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor">
                    <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/nik-shah-657ba616/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-sm border border-rule-strong px-5 py-3 font-display text-sm font-semibold tracking-tight text-ink transition-colors hover:border-flux hover:text-flux"
                >
                  <LinkedInIcon />
                  Get in touch
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="w-[11rem] sm:w-[13rem] lg:w-[15rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-rule-strong bg-ground-2">
                <Image
                  src={portrait}
                  alt="Nik Shah"
                  fill
                  sizes="(min-width: 1024px) 17vw, (min-width: 640px) 28vw, 46vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* What I'm on right now. The only place two things get equal billing. */}
        <Reveal delay={200}>
          <dl className="mt-14 grid max-w-3xl gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
            {NOW.map(({ label, detail, href }) => (
              <div key={label} className="bg-ground-2 transition-colors hover:bg-ground-3">
                <Link href={href} className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <span>
                    <dt className="t-label text-ink-3">Now</dt>
                    <dd className="mt-2 font-display text-base font-bold tracking-tight text-ink">{label}</dd>
                    <dd className="mt-1 text-sm text-ink-2">{detail}</dd>
                  </span>
                  <span aria-hidden className="t-mono shrink-0 text-copper">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
