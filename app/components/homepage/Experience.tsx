import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import Skills from "@/app/components/Skills";
import Projects from "@/app/components/homepage/Projects";
import { EDUCATION, ROLES, type Role } from "@/app/components/homepage/_data/experience";

/** Marks each boundary between roles, the way a layer edge is called out. */
function BoundaryTick() {
  return <span aria-hidden className="absolute left-0 top-0 h-px w-16 bg-copper" />;
}

/** A drawing's dimension line: end ticks, a rule, and the measurement. */
function Dimension({ children }: { children: React.ReactNode }) {
  return (
    <span className="t-mono inline-flex items-center gap-2 text-xs text-ink-3">
      <span aria-hidden className="h-2 w-px bg-rule-strong" />
      <span aria-hidden className="h-px w-3 bg-rule-strong sm:w-5" />
      {children}
      <span aria-hidden className="h-px w-3 bg-rule-strong sm:w-5" />
      <span aria-hidden className="h-2 w-px bg-rule-strong" />
    </span>
  );
}

function OrgLink({ role }: { role: Role }) {
  if (!role.orgHref) return <span>{role.org}</span>;
  const external = role.orgHref.startsWith("http");
  return (
    <Link
      href={role.orgHref}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-copper"
    >
      {role.org}
    </Link>
  );
}

function RoleHeader({ role }: { role: Role }) {
  return (
    <>
      <div className="flex items-start gap-4">
        {role.iconSrc && (
          <Image
            src={role.iconSrc}
            alt=""
            width={44}
            height={44}
            className="mt-1 shrink-0 rounded-[22%] ring-1 ring-rule-strong"
          />
        )}
        <div className="min-w-0">
          <h3 className="t-heading text-balance text-xl text-ink sm:text-2xl">{role.title}</h3>
          <p className="mt-1.5 text-[0.9375rem] text-ink-2">
            <OrgLink role={role} />
            <span aria-hidden className="px-2 text-ink-3">
              ·
            </span>
            {role.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="t-mono text-xs uppercase tracking-[0.1em] text-ink-2">{role.span}</span>
        <Dimension>{role.duration}</Dimension>
      </div>

      <p className="t-mono mt-3 text-xs leading-relaxed text-copper">{role.materials}</p>
    </>
  );
}

function RoleEntry({ role }: { role: Role }) {
  return (
    <Reveal as="li" className="relative border-t border-rule py-10 sm:py-14">
      <BoundaryTick />
      <div id={role.id} className="min-w-0 scroll-mt-24">
        <RoleHeader role={role} />

        <p className="mt-6 max-w-[62ch] text-pretty leading-[1.7] text-ink-2">{role.summary}</p>

        {role.links && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {role.links.map(({ label, href, external }) => (
              <Link
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-2 rounded-sm border border-rule-strong px-4 py-2 font-display text-[0.8125rem] font-semibold tracking-tight text-ink transition-colors hover:border-copper hover:text-copper-2"
              >
                {label}
                <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {role.highlights.length > 0 && (
          <details className="group mt-7 border-t border-rule pt-5">
            <summary className="t-label flex cursor-pointer list-none items-center gap-2.5 text-ink-2 transition-colors hover:text-copper [&::-webkit-details-marker]:hidden">
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-3 w-3 transition-transform duration-200 group-open:rotate-90"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3l5 5-5 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              What I shipped
            </summary>
            <ul className="mt-5 space-y-4">
              {role.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="relative max-w-[68ch] text-pretty pl-5 text-[0.9375rem] leading-[1.65] text-ink-2"
                >
                  <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-copper-dim" />
                  {highlight}
                </li>
              ))}
            </ul>
          </details>
        )}

        {role.projects && <Projects projects={role.projects} />}

        <Skills skills={role.skills} className="mt-8" />
      </div>
    </Reveal>
  );
}

function CompactRoleEntry({ role }: { role: Role }) {
  return (
    <Reveal as="li" className="relative border-t border-rule py-8">
      <BoundaryTick />
      <div id={role.id} className="min-w-0 scroll-mt-24">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="t-heading text-base text-ink">{role.title}</h3>
          <span className="text-[0.9375rem] text-ink-2">
            <OrgLink role={role} />
          </span>
          <span className="t-mono text-xs uppercase tracking-[0.1em] text-ink-3">
            {role.span} · {role.duration}
          </span>
        </div>
        <p className="mt-3 max-w-[62ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-2">{role.summary}</p>
        <Skills skills={role.skills} className="mt-4" />
      </div>
    </Reveal>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <h2 className="t-display text-[clamp(1.85rem,4.6vw,3rem)] text-ink">Experience</h2>
      </Reveal>

      <ol className="mt-10 sm:mt-14">
        {ROLES.map((role) =>
          role.compact ? <CompactRoleEntry key={role.id} role={role} /> : <RoleEntry key={role.id} role={role} />,
        )}
      </ol>

      <Reveal as="section" className="relative border-t border-rule py-10">
        <BoundaryTick />
        <div id="education" className="min-w-0">
          <h2 className="t-label text-ink-3">Education</h2>
          <h3 className="t-heading mt-3 text-lg text-ink sm:text-xl">{EDUCATION.degree}</h3>
          <p className="mt-1.5 text-[0.9375rem] text-ink-2">
            {EDUCATION.school}
            <span aria-hidden className="px-2 text-ink-3">
              ·
            </span>
            {EDUCATION.emphasis}
          </p>
          <p className="t-mono mt-3 text-xs uppercase tracking-[0.1em] text-ink-3">
            {EDUCATION.span} · {EDUCATION.gpa} · {EDUCATION.society}
          </p>
          <Skills skills={EDUCATION.skills} className="mt-5" />
        </div>
      </Reveal>
    </section>
  );
}
