import type { Metadata } from "next";
import Link from "next/link";
import { Mascot, SUPPORT_EMAIL, UpkeepaFooter, UpkeepaNav } from "../_components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Upkeepa's privacy policy. Upkeepa stores your data on your device and in your private iCloud account, with no third-party tracking or advertising.",
  alternates: { canonical: "/upkeepa/privacy" },
};

const EFFECTIVE = "June 28, 2026";

export default function PrivacyPage() {
  return (
    <>
      <UpkeepaNav />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <Mascot pose="done" size={120} />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#23362C]">Privacy Policy</h1>
          <p className="mt-3 text-sm text-[#6B8175]">Effective {EFFECTIVE}</p>
        </div>

        <div className="mt-10 space-y-8 text-[#3A5247] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#23362C] [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <p className="text-lg">
            Upkeepa is designed to be private by default. Your home, habits, tasks and plans are yours — this policy
            explains what the app does and doesn’t do with your information.
          </p>

          <div>
            <h2>The short version</h2>
            <ul>
              <li>Upkeepa has no accounts to create and no login.</li>
              <li>Your data is stored on your device and in your own private iCloud account.</li>
              <li>There is no third-party analytics, advertising, or tracking.</li>
              <li>The developer cannot see your tasks, habits, meals, or household data.</li>
            </ul>
          </div>

          <div>
            <h2>Information Upkeepa stores</h2>
            <p>
              Upkeepa stores the content you create — habits, tasks, lists, recurring maintenance items, planner events,
              meals, and related settings. This information is kept locally on your device using Apple’s on-device
              storage.
            </p>
          </div>

          <div>
            <h2>iCloud sync &amp; household sharing</h2>
            <p>
              If you’re signed into iCloud, Upkeepa uses Apple’s iCloud (CloudKit) to back up your data and sync it
              across your devices and with the people in your household. This data is stored in your private iCloud
              account and, for shared items, in the shared iCloud space among household members. It is handled under
              Apple’s privacy and security terms; the developer does not operate any separate server and cannot access
              the contents of your iCloud data.
            </p>
          </div>

          <div>
            <h2>Notifications</h2>
            <p>
              If you enable notifications, Upkeepa schedules local reminders on your device for the times you set. These
              are delivered by iOS and are not used to collect information about you.
            </p>
          </div>

          <div>
            <h2>What Upkeepa does not do</h2>
            <ul>
              <li>No advertising and no ad networks.</li>
              <li>No third-party analytics or tracking SDKs.</li>
              <li>No selling or sharing of your personal information.</li>
              <li>No collection of your location, contacts, or browsing activity.</li>
            </ul>
          </div>

          <div>
            <h2>Your control over your data</h2>
            <p>
              You can edit or delete any item in Upkeepa at any time; deletions sync to your other devices and household
              members. To remove all data, delete the items in the app, or delete the app and remove its data from
              Settings → Apple ID → iCloud → Manage Storage. Apple’s iCloud terms govern data held in your iCloud
              account.
            </p>
          </div>

          <div>
            <h2>Children’s privacy</h2>
            <p>
              Upkeepa is a general-purpose productivity app and does not knowingly collect personal information from
              children. It contains no ads and does not transmit your content to the developer.
            </p>
          </div>

          <div>
            <h2>Changes to this policy</h2>
            <p>If this policy changes, the updated version will be posted on this page with a new effective date.</p>
          </div>

          <div>
            <h2>Contact</h2>
            <p>
              Questions about privacy? Email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#12856B] hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-[#4B6557]">
          Back to{" "}
          <Link href="/upkeepa" className="font-semibold text-[#12856B] hover:underline">
            Upkeepa
          </Link>{" "}
          ·{" "}
          <Link href="/upkeepa/support" className="font-semibold text-[#12856B] hover:underline">
            Support
          </Link>
        </p>
      </section>

      <UpkeepaFooter />
    </>
  );
}
