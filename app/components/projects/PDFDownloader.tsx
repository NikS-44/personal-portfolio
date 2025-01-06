"use client";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), { ssr: false });

import CoverLetterPDF from "@/app/components/projects/CoverLetterPDF";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PDFDownloaderProps = {
  name: string;
  email: string;
  greeting: string;
  coverLetter: string;
  signOff: string;
  company: string;
};

export default function PDFDownloader(props: PDFDownloaderProps) {
  return (
    <PDFDownloadLink
      document={<CoverLetterPDF {...props} />}
      fileName={`${props.name.replace(/\s/g, "_")}_Cover_Letter_${props.company.replace(/\s/g, "_")}.pdf`}
    >
      <button className="inline-flex items-center rounded-lg bg-cyan-600 px-2 py-1 text-lg font-semibold text-white shadow-lg transition hover:bg-cyan-700 md:px-5">
        <span>Download PDF</span>
        <FontAwesomeIcon icon={faDownload} className="ml-2 h-4 w-4" />
      </button>
    </PDFDownloadLink>
  );
}
