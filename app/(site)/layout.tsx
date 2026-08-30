import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-copper focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-[#1a0f06]"
      >
        Skip to content
      </a>
      <Header />
      {/* The hero owns its own spacing under the fixed header; every other
          page in this group needs clearance added for it. */}
      <main id="main" className="flex-1 [&>*:first-child:not(#top)]:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
