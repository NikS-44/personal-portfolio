import type { StaticImageData } from "next/image";

import globalNavThumbnail from "@/app/assets/global-nav-thumbnail.webp";
import newTopNav from "@/app/assets/new-top-nav.gif";
import latencyThumbnail from "@/app/assets/latency-thumbnail.webp";
import latency from "@/app/assets/latency.gif";
import accessibilityThumbnail from "@/app/assets/accessibility-thumbnail.webp";
import accessibility from "@/app/assets/shopbop-accessibility.gif";
import reactLogo from "@/app/assets/react-18.webp";
import privacyNotice from "@/app/assets/privacy-notice.webp";
import SY480Thumbnail from "@/app/assets/SY480-thumbnail.webp";
import SY480 from "@/app/assets/SY480.webp";
import BL460Thumbnail from "@/app/assets/BL460-thumbnail.webp";
import BL460 from "@/app/assets/BL460.webp";
import superdomeX from "@/app/assets/superdomex.webp";
import superdomeXThumbnail from "@/app/assets/superdomex-thumbnail.webp";

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Omit for work that can't be shown. The card still carries the story. */
  thumbnail?: StaticImageData;
  details?: {
    image: StaticImageData;
    title: string;
    altText: string;
    width: number;
    height: number;
  };
}

export interface Role {
  id: string;
  title: string;
  org: string;
  orgHref?: string;
  /** Short, for the dimension line. */
  span: string;
  duration: string;
  location: string;
  /** The tech this role was built out of. Shown under the dates. */
  materials: string;
  summary: string;
  highlights: string[];
  skills: string[];
  projects?: Project[];
  /** Product marks, where one exists. */
  iconSrc?: string;
  /** Compact roles render as a single row: no highlights, no projects. */
  compact?: boolean;
  links?: { label: string; href: string; external?: boolean }[];
}

export const ROLES: Role[] = [
  {
    id: "samsara",
    title: "Senior Software Engineer, Design Systems",
    org: "Samsara",
    orgHref: "https://www.samsara.com",
    span: "Feb 2025 - present",
    duration: "1 yr 7 mo",
    location: "Remote",
    materials: "React Native · React · TypeScript · Accessibility · Design tokens",
    summary:
      "I lead Samsara's design system. The biggest thing I've shipped there is a fully featured table and filtering system that now runs in over a hundred independent places across the app. Right behind it is our new React Native mobile design system, which I built from scratch as the only developer on it. The rest of my time goes to building out the rest of the system, being ruthless about the quality of what we hand to internal teams and to our customers, and putting safeguards in place so that bar holds long after I stop watching it.",
    highlights: [
      "Built our React Native design system from scratch, solo, with no designs to work from. It's 30+ components now, from primitives up to the large composite ones, mirroring the web system but with the behavior iOS and Android actually expect. All of it meets our accessibility bar.",
      "Designed and shipped the company-wide table and filtering system that replaced four separate legacy table implementations. Better responsiveness and accessibility, and one place to fix things instead of four.",
      "Built our next-gen frontend infrastructure so feature teams can build and ship independently, including the testing framework and the intra-package router. Testing runs on MSW, screenshot testing and Vite browser testing, behind coverage guardrails that enforce themselves, partly so AI agents can't do the wrong thing.",
      "Worked with product teams to get them moved over, and wrote AI migration guides that carried 101 pages onto the new table and filter components without me touching each one.",
      "Mentored an engineering intern through shipping app-wide dark mode. That meant rewriting our global CSS onto color tokens and working out theme switching that doesn't fall apart on maps, popovers and portals.",
      "Sped up our TypeScript tooling, added strict import rules, and cut bundle size.",
    ],
    skills: [
      "React Native",
      "React",
      "TypeScript",
      "Design Systems",
      "Accessibility",
      "Design Tokens",
      "Storybook",
      "Visual Regression",
      "Dark Mode",
      "CI/CD",
      "Mentorship",
    ],
  },
  {
    id: "upkeepa",
    title: "iOS Developer",
    org: "Upkeepa",
    orgHref: "/upkeepa",
    span: "Mar 2026 - present",
    duration: "6 mo",
    location: "Self-employed",
    iconSrc: "/upkeepa/app-icon.png",
    materials: "Swift · SwiftUI · CloudKit · App Store",
    summary:
      "A daily planner for home maintenance, habits, tasks and meals. Households share one plan and a grocery list that syncs aggressively, because the whole thing falls apart the moment two people are looking at different lists. Nothing touches my servers; it all lives in the user's own CloudKit. I designed, built and shipped it on my own. It's on the App Store now.",
    highlights: [],
    skills: ["Swift", "SwiftUI", "CloudKit", "iOS", "watchOS", "Product Design", "App Store"],
    links: [
      { label: "Read about Upkeepa", href: "/upkeepa" },
      { label: "App Store", href: "https://apps.apple.com/us/app/upkeepa/id6761312689", external: true },
    ],
  },
  {
    id: "amazon",
    title: "Frontend Engineer 2 (L5)",
    org: "Amazon · Shopbop",
    orgHref: "https://www.shopbop.com",
    span: "Apr 2022 - Feb 2025",
    duration: "2 yr 11 mo",
    location: "Fort Collins, CO · Remote",
    materials: "React · TypeScript · Styled Components · Java · Node",
    summary:
      "I owned Shopbop's design system and the global parts of the site: top nav, footer, search, GDPR, legalese. I also ran the accessibility and Core Web Vitals work.",
    highlights: [
      "Cut site-wide latency and layout shift. Fixed our srcset and image optimization, added WebP, and built an internal Vite/Tailwind/React app so content schedulers could produce correctly sized media with the aspect ratio already locked in.",
      "Led an internal latency working group that raised our Lighthouse scores 6 points in 2024.",
      "Ran the React 16 to 18 upgrade across about 40 micro-frontend repos with no downtime. A couple of teams had no capacity to migrate their Enzyme tests, so I wrote shims for them.",
      "Decoupled the CMS rendering engine using iframes, taking time-to-production on CMS features from 2 weeks to 1 day.",
      "Moved Shopbop off $96K/yr of manual translation onto internal machine translation, and onboarded legalese into Amazon's legal document service.",
      "Built accessible React components for the shared library, and ran accessibility workshops for the wider org.",
    ],
    skills: [
      "React",
      "TypeScript",
      "Styled Components",
      "Core Web Vitals",
      "Accessibility",
      "Micro-Frontends",
      "AWS",
      "Java",
      "Spring MVC",
      "Node.js",
      "Cypress",
      "React Testing Library",
    ],
    projects: [
      {
        id: "nav-modernization",
        title: "Global navigation rebuild",
        description:
          "Moved the legacy JSP global navigation to React. Better animation, faster, properly responsive, and I fixed the existing bugs on the way over.",
        thumbnail: globalNavThumbnail,
        details: {
          image: newTopNav,
          title: "The React top navigation, in motion",
          altText: "The rebuilt Shopbop top navigation menu opening and closing",
          width: 1551,
          height: 811,
        },
      },
      {
        id: "latency",
        title: "Latency & layout stability",
        description:
          "Fixed our srcset and image optimization, added WebP, shored up server-side rendering, and shipped scripts that let schedulers lock aspect ratios before publishing.",
        thumbnail: latencyThumbnail,
        details: {
          image: latency,
          title: "Core Web Vitals, before and after",
          altText: "Side-by-side Core Web Vitals field data before and after the latency work",
          width: 1125,
          height: 1245,
        },
      },
      {
        id: "nav-accessibility",
        title: "Accessibility overhaul",
        description:
          "Got navigation, editorial components, search and the slide-out menus to WCAG compliance: ARIA, keyboard paths, skip links, and focus management that actually works. I turned what I learned into an internal workshop.",
        thumbnail: accessibilityThumbnail,
        details: {
          image: accessibility,
          title: "Keyboard and screen reader walkthrough",
          altText: "Keyboard navigation moving through the Shopbop header with visible focus",
          width: 1115,
          height: 815,
        },
      },
      {
        id: "react-18",
        title: "React 16 → 18, 40 repos, no downtime",
        description:
          "Designed and ran the upgrade across every micro-frontend repo. Migrated what I could to React Testing Library and shimmed the Enzyme tests that couldn't move in time.",
        thumbnail: reactLogo,
      },
      {
        id: "translation",
        title: "Automated translation & legalese",
        description:
          "Replaced $96K/yr of manual translation with internal machine translation, and moved critical legal content into Amazon's legal document service, standardizing those pages and removing them from the styling backlog entirely.",
        thumbnail: privacyNotice,
      },
    ],
  },
  {
    id: "microfocus",
    title: "Software Engineer 2",
    org: "Micro Focus",
    span: "Jul 2021 - Apr 2022",
    duration: "10 mo",
    location: "Fort Collins, CO",
    materials: "Angular · RxJS · SCSS · l10n",
    summary:
      "Built features on a new Angular SPA that replaced a legacy desktop server-monitoring app. Ended up as the team's localization person and shipped the whole app in 7 languages.",
    highlights: [],
    skills: ["Angular", "TypeScript", "RxJS", "SCSS", "l10n/i18n", "Cypress", "Jasmine"],
    compact: true,
  },
  {
    id: "hpe",
    title: "Lead System Engineer / Hardware Engineer",
    org: "Hewlett Packard Enterprise",
    span: "Feb 2011 - Jul 2021",
    duration: "10 yr 6 mo",
    location: "Fort Collins, CO",
    materials: "PCB design · PCIe · FPGA · Signal integrity · DDR3/4",
    summary:
      "Ten years of PCB design, bring-up and electrical qualification on HPE's graphics and mission-critical server products. I designed boards, guided ODM engineers on layout best practices, and spent a lot of hours on an oscilloscope proving a bus was clean.",
    highlights: [
      "Owned system design and architecture for graphics workstation blade products across the Synergy and C-Class sidecar lines.",
      "Designed a mobile-graphics (MXM) adapter that brought NVIDIA and AMD graphics to server blades.",
      "Did schematic and constraint entry for the Superdome X motherboard sub-design (Freescale PPC, Lattice CPLD, Altera FPGA) and brought the hardware up with the FPGA and power teams.",
      "Ran Superdome X phase-II qualification and signal integrity analysis across DDR3, I²C, SATA, PCIe Gen1/Gen3, NAND, NOR, SPI and USB.",
      "Led ODM design reviews and root-cause analysis on factory and customer returns, including critical escalations.",
      "Wrote a library of Bash and Python tooling for GPU hardware validation and benchmarking.",
    ],
    skills: [
      "PCB Design",
      "Hardware Architecture",
      "PCIe",
      "DDR3/4",
      "Signal Integrity",
      "FPGA",
      "Hardware Verification",
      "ODM Management",
      "NVIDIA/AMD GPUs",
      "Python",
      "Shell",
    ],
    projects: [
      {
        id: "hpe-sy480",
        title: "Synergy 480 GPU sidecars",
        description:
          "Led architecture, design and development of PCIe Gen4 sidecar motherboards for high-density GPU deployments in bladed servers: multiple PCBs, large power envelopes, PCIe retimers and switches, and a hard mechanical/thermal problem.",
        thumbnail: SY480Thumbnail,
        details: {
          image: SY480,
          title: "Synergy 480 GPU sidecar and expansion options",
          altText: "HPE Synergy 480 GPU sidecar boards and expansion options",
          width: 1024,
          height: 991,
        },
      },
      {
        id: "hpe-bl460",
        title: "WS460c GPU sidecars",
        description:
          "Inherited a PCIe Gen3 sidecar with live customer escalations. Traced the impedance problem to the flex cables, shipped a remote PCIe firmware updater ISO customers could deploy themselves, then designed the next generation without the troublesome parts.",
        thumbnail: BL460Thumbnail,
        details: {
          image: BL460,
          title: "WS460c GPU sidecar and expansion options",
          altText: "HPE WS460c GPU sidecar boards and expansion options",
          width: 1024,
          height: 643,
        },
      },
      {
        id: "hpe-superdomex",
        title: "Superdome X management hardware",
        description:
          "PCB design for the FPGA and manageability hardware on the first x86 Superdome, HPE's mission-critical blade server, moving off Itanium. Shipped with a cross-functional team of PCB, ASIC, signal integrity, layout and mechanical engineers.",
        thumbnail: superdomeXThumbnail,
        details: {
          image: superdomeX,
          title: "Superdome X, an 8-blade mission-critical server",
          altText: "HPE Superdome X eight-blade mission-critical server chassis",
          width: 800,
          height: 400,
        },
      },
    ],
  },
];

export const EDUCATION = {
  degree: "B.S., Computer & Electrical Engineering",
  emphasis: "Embedded Systems",
  school: "The University of Texas at Austin",
  span: "2007 - 2010",
  society: "Eta Kappa Nu",
  gpa: "3.85 GPA",
  skills: ["Algorithms", "Embedded Systems", "Computer Architecture", "VLSI", "Software Engineering"],
};
