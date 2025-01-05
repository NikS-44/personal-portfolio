import React from "react";
import { Metadata } from "next";
import LinkedInHelper from "@/app/components/projects/LinkedInHelper";

export const metadata: Metadata = {
  title: "LinkedIn Search Link Generator",
};

export default function Page() {
  return <LinkedInHelper />;
}
