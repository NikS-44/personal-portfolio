import React from "react";
import { Metadata } from "next";
import LinkedInGenerator from "@/app/components/projects/LinkedInGenerator";

export const metadata: Metadata = {
  title: "LinkedIn Search Link Generator",
};

export default function Page() {
  return <LinkedInGenerator />;
}
