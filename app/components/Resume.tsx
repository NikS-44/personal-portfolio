import Badges, { Badge } from "@/app/components/Badges";

const AMAZON_SKILLS: Badge[] = [
  { text: "Typescript" },
  { text: "React" },
  { text: "Styled Components" },
  { text: "AWS" },
  { text: "Redux" },
  { text: "Spring MVC" },
  { text: "Accessibility" },
  { text: "Core Web Vitals" },
  { text: "Tailwind CSS" },
  { text: "React Testing Library" },
  { text: "Cypress" },
  { text: "Java" },
  { text: "Python" },
  { text: "CI/CD" },
  { text: "Linux & Shell Scripting" },
  { text: "Storybook" },
  { text: "Web Performance" },
];

const MICROFOCUS_SKILLS: Badge[] = [
  { text: "Typescript" },
  { text: "Angular" },
  { text: "SCSS" },
  { text: "RxJS" },
  { text: "l10n/i18n" },
  { text: "Docker" },
  { text: "Spring" },
  { text: "Cypress" },
];

const HPE_SKILLS: Badge[] = [
  { text: "PCB Design" },
  { text: "Hardware Architecture" },
  { text: "PCIe" },
  { text: "DDR3/4" },
  { text: "Hardware Verification" },
  { text: "Stress Testing" },
  { text: "ODM Management" },
  { text: "NVIDIA/AMD GPUs" },
  { text: "FPGA Design" },
  { text: "Linux & Shell Scripting" },
  { text: "Python" },
  { text: "Project Management" },
];

const UNIVERSITY_SKILLS: Badge[] = [
  { text: "Algorithms" },
  { text: "Embedded Systems" },
  { text: "Computer Architecture" },
  { text: "VLSI" },
  { text: "Software Engineering" },
];

const Resume = () => {
  return (
    <div className="mx-auto max-w-screen-lg p-8 text-white shadow-lg">
      <section className="mt-8">
        <h2 className="border-b pb-2 text-2xl font-semibold">Experience</h2>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Frontend Software Engineer – L5</h3>
          <p className="text-gray-200">
            Amazon -{" "}
            <a href={"https://www.shopbop.com"} className={"underline"}>
              shopbop.com
            </a>{" "}
            | Fort Collins, CO (Remote) | April 2022 - Present
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>
              Owned implementation for new accessible and responsive global features including Top Navigation and Footer
              as well as maintenance of Search, GDPR, and Legalese features.
            </li>
            <li>
              Drove efforts to reduce site-wide latency and cumulative layout shift (CLS) by working with
              cross-functional teams to get buy-in for editorial content latency initiatives, implementing image and
              video optimization strategies in Editorial React components, and building an internal Vite/Tailwind/React
              app to generate properly optimized content.
            </li>
            <li>
              Improved internal CMS implementation by developing POCs and driving an initiative to decouple the
              rendering engine using iframes, reducing time-to-production on CMS features from 2 weeks to 1 day.
            </li>
            <li>
              Led an internal working group on latency that resulted in a 6-point increase in Lighthouse scores in 2024.
            </li>
            <li>
              Elevated frontend expertise across the organization through mentorship, code reviews, accessibility
              workshops, and fostering an open team culture.
            </li>
            <li>Built React/Styled Components/TypeScript components for Shopbop&apos;s component library.</li>
            <li>
              Delivered projects and participated in on-call rotation for full-stack features including SpringMVC
              applications, APIs (Java), React Micro-Frontends, and Node.js Lambdas.
            </li>
          </ul>
          <Badges badges={AMAZON_SKILLS} />
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Intermediate Frontend Software Engineer</h3>
          <p className="text-gray-200">Microfocus | Fort Collins, CO | July 2021 - April 2022</p>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>Implemented frontend designs in Angular 9+ using TypeScript, CSS, and HTML5.</li>
            <li>
              Collaborated with UX/UI designers and backend engineers to define and improve new frontend features and
              APIs.
            </li>
          </ul>
          <Badges badges={MICROFOCUS_SKILLS} />
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">System Engineer / Lead Hardware Engineer</h3>
          <p className="text-gray-200">Hewlett-Packard Enterprise | Fort Collins, CO | Feb 2011 - July 2021</p>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>
              Responsible for system design and architecture on Graphics Workstation Blade products for Synergy and
              C-Class sidecars.
            </li>
            <li>
              Managed schematic design, layout, and design verification of PCBs on Superdome X, C-Class, and Synergy
              product lines.
            </li>
            <li>
              Led ODM design reviews, multidisciplinary engineering meetings, troubleshooting, and technical resolutions
              for critical customer escalations.
            </li>
            <li>Created a library of Bash and Python scripts for GPU hardware validation.</li>
          </ul>
        </div>
        <Badges badges={HPE_SKILLS} />
      </section>
      <section className="mt-8">
        <h2 className="border-b pb-2 text-2xl font-semibold">Education</h2>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">B.S., Computer and Electrical Engineering</h3>
          <p className="text-gray-200">August 2007 - December 2010</p>
          <p className="text-gray-200">University of Texas at Austin</p>
        </div>
        <Badges badges={UNIVERSITY_SKILLS} />
      </section>
      <section className="mt-8">
        <p className="text-sm text-gray-200">Work Status: US Citizen</p>
      </section>
    </div>
  );
};

export default Resume;
