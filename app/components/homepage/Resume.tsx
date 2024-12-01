"use client";
import Badges, { Badge } from "@/app/components/Badges";
import useIntersectionObserver from "@/app/hooks/useIntersectionObserver";
import globalNavThumbnail from "@/app/assets/global-nav-thumbnail.webp";
import newTopNav from "@/app/assets/new-top-nav.gif";
import latencyThumbnail from "@/app/assets/latency-thumbnail.webp";
import latency from "@/app/assets/latency.gif";
import accessibilityThumbnail from "@/app/assets/accessibility-thumbnail.webp";
import { Project, ProjectCarousel } from "@/app/components/projects/ProjectComponents";
import { useState } from "react";

const AMAZON_PROJECTS: Project[] = [
  {
    id: "nav-modernization",
    title: "Global Navigation Modernization Initiative",
    description:
      "Migrated our legacy JSP global navigation to React and improved the animations, optimized performance, fixed existing bugs, and made the menu fully responsive.",
    thumbnail: globalNavThumbnail,
    details: {
      image: newTopNav,
      title: "New React Top Navigation Menu",
      altText: "Navigation component showcase",
      width: 1551,
      height: 811,
    },
  },
  {
    id: "latency",
    title: "Shopbop Latency Improvements",
    description:
      "Reduced real and perceived latency by correcting our srcset/image optimization implementations, adding webp support, enhancing server-side rendering for editorial content, and adding tooling for content schedulers to be able to easily extract and provide height/width to scheduled content to prevent layout shifts.",
    thumbnail: latencyThumbnail,
    details: {
      image: latency,
      title: (
        <div className={"flex"}>
          <span className={"flex-1"}>Before</span>
          <span className={"flex-1"}>After</span>
        </div>
      ),
      altText: "Navigation component showcase",
      width: 1125,
      height: 1245,
    },
  },
  {
    id: "nav-accessibility",
    title: "Accessibility Enhancements",
    description:
      "I made our top navigation, editorial components, and menu slide outs fully WCAG compliant by adding keyboard navigation and full screen reader support. Also developed and presented an internal accessibility workshop with methods and learnings from this project.",
    thumbnail: accessibilityThumbnail,
  },
];

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

const ExpandableSection = ({ summary, children }: { summary: string; children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <p className="mb-4 text-gray-200">{summary}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 rounded-lg bg-cyan-900/30 px-4 py-2 text-sm text-cyan-100 transition-all hover:bg-cyan-800/40"
      >
        <span>Job Highlights</span>
        <svg
          className={`h-4 w-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <ul className="animate-fadeIn list-disclosure-closed ml-2 mt-4 list-inside space-y-3 sm:ml-6">{children}</ul>
      )}
    </div>
  );
};

const Resume = () => {
  const experienceRef = useIntersectionObserver();
  const amazonRef = useIntersectionObserver();
  const microfocusRef = useIntersectionObserver();
  const hpeRef = useIntersectionObserver();
  const educationRef = useIntersectionObserver();
  const citizenRef = useIntersectionObserver();
  return (
    <div className="mx-auto max-w-screen-lg px-8 text-white shadow-lg">
      <section>
        <h2 ref={experienceRef} className="border-b pb-2 text-2xl font-semibold opacity-0">
          Experience
        </h2>
        <div ref={amazonRef} className="mt-6 opacity-0">
          <h3 className="text-xl font-semibold">Frontend Software Engineer – L5</h3>
          <p className="text-gray-200">
            Amazon -{" "}
            <a href={"https://www.shopbop.com"} className={"underline"}>
              shopbop.com
            </a>{" "}
            | Fort Collins, CO (Remote) | April 2022 - Present
          </p>
          <ExpandableSection
            summary={
              "I owned implementation and maintenance for projects including Global Navigation Accessibility Overhaul & React Migration, Design System Development/Documentation, React 18 migration, Homepage Editorial Components, Search, GDPR, Legalese Pages, and Footer. " +
              "I also drove accessibility and Core Web Vitals (web performance) initiatives and introduced improvements to partner workflows that increased delivery speed of editorial content by 30%. " +
              "I championed frontend excellence and openness across the organization through pairing/mentorship, empathetic code reviews, and workshops/presentations."
            }
          >
            <li>
              Drove efforts to reduce site-wide latency and cumulative layout shift (CLS) by working with
              cross-functional teams to get buy-in for editorial content latency initiatives, implementing image and
              video optimization strategies in Editorial React components, and building an internal Vite/Tailwind/React
              app to generate properly optimized content.
            </li>
            <li>
              Built responsive and accessible shared components for Shopbop&apos;s component library using React/Styled
              Components/TypeScript
            </li>
            <li>
              Led and implemented a React 16 to React 18 migration across 40+ Microfrontend and framework repos at
              Shopbop without any downtime. Efforts included upgrading various dependencies, upgrading local development
              servers, adding Enzyme shims for teams without capacity, and maintaining a parallel React 18 environment
              for testing our upgrades.
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
            <li>
              Delivered projects and participated in on-call rotation for full-stack features including SpringMVC
              applications, APIs (Java), React Micro-Frontends, and Node.js Lambdas.
            </li>
          </ExpandableSection>
          <ProjectCarousel projects={AMAZON_PROJECTS} />
          <Badges badges={AMAZON_SKILLS} />
        </div>
        <div ref={microfocusRef} className="mt-6 opacity-0">
          <h3 className="text-xl font-semibold">Intermediate Frontend Software Engineer</h3>
          <p className="text-gray-200">Microfocus | Fort Collins, CO | July 2021 - April 2022</p>
          <ExpandableSection
            summary={
              "I worked on a team migrated our legacy desktop application to a SaaS dashboard written using Angular and SCSS. " +
              "I was responsible for new UI features, bug fixes, code reviews, and L10n across our whole application."
            }
          >
            <li>Implemented frontend designs in Angular 9+ and SCSS.</li>
            <li>
              Collaborated with UX/UI designers and backend engineers to define and improve new frontend features and
              APIs.
            </li>
            <li>
              Implemented translations for our whole app and become the team&apos;s SME on translation best practices.
            </li>
          </ExpandableSection>
          <Badges badges={MICROFOCUS_SKILLS} />
        </div>
        <div ref={hpeRef} className="mt-6 opacity-0">
          <h3 className="text-xl font-semibold">System Engineer / Lead Hardware Engineer</h3>
          <p className="text-gray-200">Hewlett-Packard Enterprise | Fort Collins, CO | Feb 2011 - July 2021</p>
          <ExpandableSection
            summary={
              "I was a lead hardware engineer and system architect on Synergy and C-Class Graphics Sidecars. " +
              "I lead a team responsible for design and qualification for these projects as well as led efforts with " +
              "ODM/JDM partners to our define architecture, design, and layout. Prior to that work, I owned the " +
              "PCB design, layout, and phase 2 qualification for for the FPGA and manageability hardware on SuperdomeX, " +
              "a x86 mission-critical bladed server."
            }
          >
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
          </ExpandableSection>
          <Badges badges={HPE_SKILLS} />
        </div>
      </section>
      <section ref={educationRef} className="mt-8 opacity-0">
        <h2 className="border-b pb-2 text-2xl font-semibold">Education</h2>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">B.S., Computer and Electrical Engineering</h3>
          <p className="text-gray-200">August 2007 - December 2010</p>
          <p className="text-gray-200">University of Texas at Austin</p>
        </div>
        <Badges badges={UNIVERSITY_SKILLS} />
      </section>
      <section ref={citizenRef} className="mt-8 opacity-0">
        <p className="text-sm text-gray-200">Work Status: US Citizen</p>
      </section>
    </div>
  );
};

export default Resume;
