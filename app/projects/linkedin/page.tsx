"use client";

import React, { useState, useEffect, useRef } from "react";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";

export default function LinkedInGenerator() {
  const [inputURL, setInputURL] = useState("");
  const [selectedTime, setSelectedTime] = useState("3600"); // default to 1 hour
  const [keywords, setKeywords] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [finalURL, setFinalURL] = useState("");
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      const savedURL = localStorage.getItem("lg_inputURL");
      const savedTime = localStorage.getItem("lg_selectedTime");
      const savedKeywords = localStorage.getItem("lg_keywords");
      const savedExclusions = localStorage.getItem("lg_exclusions");

      if (savedURL) setInputURL(savedURL);
      if (savedTime) setSelectedTime(savedTime);

      if (savedKeywords) {
        const parsed = JSON.parse(savedKeywords);
        setKeywords(parsed.length > 0 ? parsed : [""]);
      } else {
        setKeywords([""]);
      }

      if (savedExclusions) {
        const parsed = JSON.parse(savedExclusions);
        setExclusions(parsed.length > 0 ? parsed : [""]);
      } else {
        setExclusions([""]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lg_inputURL", inputURL);
    localStorage.setItem("lg_selectedTime", selectedTime);
    localStorage.setItem("lg_keywords", JSON.stringify(keywords));
    localStorage.setItem("lg_exclusions", JSON.stringify(exclusions));
  }, [inputURL, selectedTime, keywords, exclusions]);

  useEffect(() => {
    generateLink();
  }, [inputURL, selectedTime, keywords, exclusions]);

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newKeywords = [...keywords];
    newKeywords[idx] = e.target.value;
    setKeywords(newKeywords);
  };

  const handleExclusionChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newExclusions = [...exclusions];
    newExclusions[idx] = e.target.value;
    setExclusions(newExclusions);
  };

  const addKeyword = () => {
    setKeywords([...keywords, ""]);
  };

  const addExclusion = () => {
    setExclusions([...exclusions, ""]);
  };

  const generateLink = () => {
    if (!inputURL) {
      setFinalURL("");
      return;
    }

    let parsedURL: URL;
    try {
      parsedURL = new URL(inputURL);
    } catch (err) {
      setFinalURL("");
      console.log(err);
      return;
    }

    const validKeywords = keywords.map((k) => k.trim()).filter(Boolean);
    const validExclusions = exclusions.map((e) => e.trim()).filter(Boolean);

    let keywordString = "";
    if (validKeywords.length > 0) {
      keywordString = validKeywords.join(" AND ");
    }
    if (validExclusions.length > 0) {
      if (keywordString.length > 0) {
        keywordString += " ";
      }
      keywordString += `NOT (${validExclusions.join(" OR ")})`;
    }

    if (keywordString) {
      parsedURL.searchParams.set("keywords", keywordString);
    } else {
      parsedURL.searchParams.delete("keywords");
    }

    parsedURL.searchParams.set("f_TPR", "r" + selectedTime);

    setFinalURL(parsedURL.toString());
  };

  return (
    <div className="mx-4 mt-20 max-w-screen-lg rounded-lg bg-gray-900 px-4 py-6 shadow-lg sm:px-8 lg:mx-auto">
      <h2 className="border-b border-gray-700 pb-2 text-2xl font-semibold text-white">
        <div className="inline-flex items-center gap-2">
          <LinkedInIcon />
          LinkedIn Search Link Generator
        </div>
      </h2>
      <div className="mt-6">
        <label htmlFor="linkedinUrl" className="mb-1 block text-sm font-semibold text-gray-300">
          LinkedIn Job Search URL
        </label>
        <input
          id="linkedinUrl"
          type="text"
          placeholder="e.g. https://www.linkedin.com/jobs/search/?f_WT=2&keywords=..."
          value={inputURL}
          onChange={handleURLChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="timeSelect" className="mb-1 block text-sm font-semibold text-gray-300">
          Time Range
        </label>
        <select
          id="timeSelect"
          value={selectedTime}
          onChange={handleTimeChange}
          className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-600"
        >
          <option value="3600">1 Hour</option>
          <option value="14400">4 Hours</option>
          <option value="43200">12 Hours</option>
          <option value="86400">24 Hours</option>
          <option value="259200">3 Days</option>
          <option value="432000">5 Days</option>
        </select>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">Keywords (AND)</h3>
        {keywords.map((value, idx) => (
          <input
            key={`keyword-${idx}`}
            type="text"
            placeholder="Keyword..."
            value={value}
            onChange={(e) => handleKeywordChange(e, idx)}
            className="mb-2 block w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
          />
        ))}
        <button
          onClick={addKeyword}
          className="mt-1 rounded-lg bg-cyan-800/40 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-800/60"
        >
          + Add Keyword
        </button>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">Excluded Companies (OR)</h3>
        {exclusions.map((value, idx) => (
          <input
            key={`exclusion-${idx}`}
            type="text"
            placeholder="Excluded Company..."
            value={value}
            onChange={(e) => handleExclusionChange(e, idx)}
            className="mb-2 block w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
          />
        ))}
        <button
          onClick={addExclusion}
          className="mt-1 rounded-lg bg-cyan-800/40 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-800/60"
        >
          + Add Exclusion
        </button>
      </div>
      <div className="mt-8">
        <h4 className="mb-2 text-sm font-semibold text-gray-300">Generated Link</h4>
        {finalURL ? (
          <a href={finalURL} target="_blank" rel="noopener noreferrer" className="break-words text-cyan-400 underline">
            {finalURL}
          </a>
        ) : (
          <p className="text-sm text-gray-400">Enter a valid LinkedIn URL to generate a link.</p>
        )}
      </div>
    </div>
  );
}
