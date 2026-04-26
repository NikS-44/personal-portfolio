import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join UpKeepr Plan",
  description: "Download UpKeepr to join a shared household plan.",
};

export default function UpKeeprSharePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Join an UpKeepr Plan</h1>
      <p className="max-w-md text-lg text-gray-400">
        Someone invited you to share a household plan on UpKeepr. Open the app or download it to get started.
      </p>
      <a
        href="https://apps.apple.com/app/upkeepr/id6744257305"
        className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
      >
        Get UpKeepr on the App Store
      </a>
    </div>
  );
}
