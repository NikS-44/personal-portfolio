import { AppStoreBadge, Mascot, UpkeepaFooter, UpkeepaNav } from "./_components/ui";

const features = [
  {
    pose: "wrench",
    title: "Home upkeep on autopilot",
    body: "Track recurring maintenance — filters, smoke detectors, the car, the gutters — and Upkeepa resurfaces each one right when it's due.",
  },
  {
    pose: "flex",
    title: "Habits that actually stick",
    body: "Build daily and weekly habits, keep your streak alive, and climb tiers. Upkeepa cheers you on every time you check one off.",
  },
  {
    pose: "thinking",
    title: "A planner for today",
    body: "One clear Today view: overdue items, tasks, habits and upkeep — sorted so the things that matter lead. Or zoom out to the full schedule.",
  },
  {
    pose: "reminder",
    title: "Tasks & reminders",
    body: "Quick to-dos and household lists with reminder times, so nothing slips between the cracks of a busy week.",
  },
  {
    pose: "happy",
    title: "Plan your meals",
    body: "Map out breakfast, lunch and dinner, pull from your own recipes and favorite restaurants, and see the day's meals right in your planner.",
  },
  {
    pose: "wave",
    title: "Share with your household",
    body: "Sync across your devices and family with iCloud — everyone sees the same plan, the same chores, the same wins.",
  },
];

const steps = [
  {
    n: "1",
    title: "Add what you take care of",
    body: "Habits, household chores, recurring upkeep, tasks and meals — set them once.",
  },
  {
    n: "2",
    title: "Open Today",
    body: "Upkeepa surfaces exactly what needs you now, and quietly tucks away what doesn't.",
  },
  {
    n: "3",
    title: "Check things off",
    body: "Build streaks, keep your home in good repair, and let Upkeepa do the celebrating.",
  },
];

const mascotPoses = ["wave", "happy", "wrench", "flex", "thinking", "celebrate", "done", "proud", "winking", "napping"];

export default function UpkeepaPage() {
  return (
    <>
      <UpkeepaNav />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 0%, #DDF1E6 0%, rgba(221,241,230,0) 70%), linear-gradient(180deg, #F4FAF6 0%, #EAF5EE 100%)",
          }}
        />
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 sm:py-24 md:grid-cols-2">
          <div className="upkeepa-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#CDE9D8] bg-white/70 px-3 py-1 text-xs font-semibold text-[#12856B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5C24B]" />
              For iPhone &amp; Apple Watch
            </span>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-[#23362C] sm:text-5xl">
              Keep your home, habits &amp; day in good repair.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[#4B6557]">
              Upkeepa brings home maintenance, habits, tasks and meal planning into one friendly planner — and shows you
              exactly what today needs. Meet your tiny, tireless house-helper.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AppStoreBadge />
              <a href="#features" className="text-sm font-semibold text-[#12856B] hover:text-[#0E6D58]">
                See what it does →
              </a>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div
              aria-hidden
              className="absolute h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, #CFEBDA 0%, rgba(207,235,218,0) 70%)" }}
            />
            <Mascot pose="wave" size={300} float className="relative drop-shadow-sm" />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#23362C]">
            Everything your household forgets, in one place
          </h2>
          <p className="mt-3 text-[#4B6557]">
            Upkeepa is the gentle nudge between “I should really do that” and actually getting it done.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[#CDE9D8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6F4EC]">
                <Mascot pose={f.pose} size={52} className="transition-transform group-hover:scale-110" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#23362C]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B6557]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="bg-[#EAF5EE] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#23362C]">Up and running in three taps</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12856B] text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#23362C]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B6557]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Upkeepa ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-[#23362C]">Meet Upkeepa</h2>
        <p className="mx-auto mt-3 max-w-xl text-[#4B6557]">
          Part house, part handy little buddy. Upkeepa reacts to your day — waving you in, flexing on a streak, napping
          when there’s nothing left to do.
        </p>
        <div className="mt-10 flex flex-wrap items-end justify-center gap-x-4 gap-y-6">
          {mascotPoses.map((pose, i) => (
            <Mascot key={pose} pose={pose} size={i % 3 === 0 ? 92 : 74} className="opacity-95" />
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#12856B] px-6 py-14 text-center text-white shadow-lg sm:px-12">
          <Mascot pose="celebrate" size={120} className="mx-auto" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Give your home a helper.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">
            Download Upkeepa and let the little house keep your habits, chores and plans in good repair.
          </p>
          <div className="mt-8 flex justify-center">
            <AppStoreBadge className="bg-white !text-[#23362C] hover:bg-white" />
          </div>
        </div>
      </section>

      <UpkeepaFooter />
    </>
  );
}
