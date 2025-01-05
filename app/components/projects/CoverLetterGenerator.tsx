"use client";

import React, { useEffect, useRef, useState } from "react";
import Input from "@/app/components/projects/Input";
import TextArea from "@/app/components/projects/TextArea";
import { faArrowsSpin, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CoverLetterPDF from "@/app/components/projects/CoverLetterPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const CoverLetterGenerator = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSpecificEmphasis, setJobSpecificEmphasis] = useState("");
  const [greeting, setGreeting] = useState("Dear Hiring Team,");
  const [coverLetter, setCoverLetter] = useState("");
  const [signOff, setSignOff] = useState("Thank you for your time and consideration,");
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          resume,
          jobDescription,
          jobSpecificEmphasis,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate cover letter");
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      const savedName = localStorage.getItem("cl_name");
      const savedEmail = localStorage.getItem("cl_email");
      const savedResume = localStorage.getItem("cl_resume");
      const savedGreeting = localStorage.getItem("cl_greeting");
      const savedSignOff = localStorage.getItem("cl_signOff");
      if (savedName) {
        setName(savedName);
      }
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedResume) {
        setResume(savedResume);
      }
      if (savedGreeting) {
        setGreeting(savedGreeting);
      }
      if (savedSignOff) {
        setSignOff(savedSignOff);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cl_name", name);
    localStorage.setItem("cl_email", email);
    localStorage.setItem("cl_resume", resume);
    localStorage.setItem("cl_greeting", greeting);
    localStorage.setItem("cl_signOff", signOff);
  }, [resume, name, email, greeting, signOff]);

  return (
    <div>
      <div className="mx-4 max-w-screen-lg rounded-lg bg-gray-900 px-4 py-6 shadow-lg sm:px-8 lg:mx-auto">
        <h2 className="flex flex-col items-center gap-2 border-b border-gray-700 pb-2 text-lg font-semibold text-white md:flex-row md:gap-20 md:text-2xl">
          <div className="inline-flex items-center gap-2">
            <span>Cover Letter Generator</span>
          </div>
          <div className="my-1 flex justify-center md:my-4">
            {!loading && (
              <button
                onClick={handleGenerate}
                className="inline-flex items-center rounded-lg bg-cyan-600 px-2 py-1 text-lg font-semibold text-white shadow-lg transition hover:bg-cyan-700 md:px-5"
              >
                <span>Generate Cover Letter</span>
                <FontAwesomeIcon icon={faArrowsSpin} className="ml-2 h-4 w-4" />
              </button>
            )}
            {loading && (
              <button
                className="inline-flex items-center rounded-lg bg-cyan-600 px-2 py-1 text-lg font-semibold text-white shadow-lg transition hover:bg-cyan-700 md:px-5"
                disabled
              >
                <span className="generating text-left">Generating...</span>
                <FontAwesomeIcon icon={faArrowsSpin} className="ml-2 h-4 w-4 animate-spin" />
              </button>
            )}
          </div>
          <div className="my-1 flex justify-center md:my-4">
            <PDFDownloadLink
              document={
                <CoverLetterPDF
                  name={name}
                  email={email}
                  greeting={greeting}
                  coverLetter={coverLetter}
                  signOff={signOff}
                />
              }
              fileName={`${name.replace(/\s/g, "_") + "_"}Cover_Letter_${company.replace(/\s/g, "_")}.pdf`}
            >
              <button className="inline-flex items-center rounded-lg bg-cyan-600 px-2 py-1 text-lg font-semibold text-white shadow-lg transition hover:bg-cyan-700 md:px-5">
                <span>Download PDF</span>
                <FontAwesomeIcon icon={faDownload} className="ml-2 h-4 w-4" />
              </button>
            </PDFDownloadLink>
          </div>
        </h2>
        <Input label={"Name"} value={name} onChange={(e) => setName(e.target.value)} placeHolder={"e.g. Nik Shah"} />
        <Input
          label={"Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeHolder={"e.g. nikshahee@gmail.com"}
        />
        <TextArea
          label={"Resume"}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeHolder={"Paste Your Resume Here"}
          className={"h-32"}
        />
        <Input
          label={"Company (Optional)"}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeHolder={"e.g. Nvidia"}
        />
        <TextArea
          label={"Job Description"}
          value={jobDescription}
          placeHolder={"Paste The Job Description Here"}
          onChange={(e) => setJobDescription(e.target.value)}
          className={"h-32"}
        />
        <TextArea
          label={"Tell us what you want to emphasize about yourself in relation to this job"}
          value={jobSpecificEmphasis}
          onChange={(e) => setJobSpecificEmphasis(e.target.value)}
          className={"min-h-24"}
          placeHolder={
            "- I have X years of experience in...\n" +
            "- I helped my former company accomplish...\n" +
            "- I think I would be a good fit because..."
          }
          autoResize
        />
        <Input
          label={"Greeting"}
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          placeHolder={"e.g. Dear Hiring Team,"}
        />
        <TextArea
          label={"Cover Letter Contents (You can edit this before downloading)"}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className={""}
          placeHolder={"Cover Letter Contents"}
          autoResize
        />
        <Input
          label={"Sign Off"}
          value={signOff}
          onChange={(e) => setSignOff(e.target.value)}
          placeHolder={"e.g. Thank you for your time and consideration,"}
        />
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
