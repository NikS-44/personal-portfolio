import React from "react";
import { Metadata } from "next";
import CoverLetterGenerator from "@/app/components/projects/CoverLetterGenerator";

export const metadata: Metadata = {
  title: "Cover Letter Generator",
};

export default function Page() {
  return <CoverLetterGenerator />;
}
