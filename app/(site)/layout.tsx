import Header from "@/app/components/global/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="[&>*:first-child]:pt-20">{children}</main>
    </>
  );
}
