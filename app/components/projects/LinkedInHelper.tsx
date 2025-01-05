"use client";

import React, { useEffect, useRef, useState } from "react";
import LinkedInIcon from "@/app/components/icons/LinkedInIcon";

export default function LinkedInHelper() {
  const [inputURL, setInputURL] = useState("");
  const [selectedTime, setSelectedTime] = useState("14400");
  const [selectedSalary, setSelectedSalary] = useState("0");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [finalURL, setFinalURL] = useState("");
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      const savedURL = localStorage.getItem("lg_inputURL");
      const savedTime = localStorage.getItem("lg_selectedTime");
      const savedSalary = localStorage.getItem("lg_selectedSalary");
      const savedKeywords = localStorage.getItem("lg_keywords");
      const savedExclusions = localStorage.getItem("lg_exclusions");

      if (savedURL) {
        setInputURL(savedURL);
      } else {
        setInputURL("https://www.linkedin.com/jobs/search?f_WT=2");
      }

      if (savedTime) setSelectedTime(savedTime);

      if (savedSalary) setSelectedSalary(savedSalary);

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
    localStorage.setItem("lg_selectedSalary", selectedSalary);
    localStorage.setItem("lg_keywords", JSON.stringify(keywords));
    localStorage.setItem("lg_exclusions", JSON.stringify(exclusions));
  }, [inputURL, selectedTime, selectedSalary, keywords, exclusions]);

  useEffect(() => {
    generateLink();
  }, [inputURL, selectedTime, keywords, exclusions, selectedSalary]);

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSalary(e.target.value);
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

  const removeKeyword = (idx: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExclusion = (idx: number) => {
    setExclusions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (keywords[idx].trim() !== "" && idx === keywords.length - 1) {
        addKeyword();
      }
    }
  };

  const handleExclusionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (exclusions[idx].trim() !== "" && idx === exclusions.length - 1) {
        addExclusion();
      }
    }
  };

  const addKeyword = () => {
    setKeywords((prev) => {
      const next = [...prev, ""];
      setTimeout(() => {
        const fields = document.querySelectorAll("[data-keyword-input]");
        const newField = fields[fields.length - 1] as HTMLInputElement;
        newField?.focus();
      }, 0);
      return next;
    });
  };

  const addExclusion = () => {
    setExclusions((prev) => {
      const next = [...prev, ""];
      setTimeout(() => {
        const fields = document.querySelectorAll("[data-exclusion-input]");
        const newField = fields[fields.length - 1] as HTMLInputElement;
        newField?.focus();
      }, 0);
      return next;
    });
  };

  const generateLink = () => {
    if (!inputURL) {
      setFinalURL("");
      return;
    }
    let parsedURL: URL;
    try {
      parsedURL = new URL(inputURL);
    } catch {
      setFinalURL("");
      return;
    }
    const validKeywords = keywords.map((k) => k.trim()).filter(Boolean);

    // Wrap exclusions in quotes, since LinkedIn doesn't handle multi-word companies without quotes
    const validExclusions = exclusions
      .map((e) => e.trim())
      .filter(Boolean)
      .map((e) => `"${e}"`); // wrap in quotes

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

    if (selectedSalary !== "0") {
      parsedURL.searchParams.set("f_SB2", selectedSalary);
    }

    setFinalURL(parsedURL.toString());
  };

  return (
    <div>
      <div className="mx-4 max-w-screen-lg rounded-lg bg-gray-900 px-4 py-6 shadow-lg sm:px-8 lg:mx-auto">
        <h2 className="flex flex-row gap-5 border-b border-gray-700 pb-2 text-lg font-semibold text-white md:gap-20 md:text-2xl">
          <div className="inline-flex items-center gap-2">
            <LinkedInIcon />
            <span>LinkedIn</span>
            <span className="hidden md:inline">Search</span>
            <span>Helper</span>
          </div>
          <div className="my-4 flex justify-center">
            {finalURL && (
              <a
                href={finalURL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-lg px-2 py-1 text-sm font-semibold text-white shadow-lg transition md:px-5 md:text-lg ${
                  finalURL ? "bg-cyan-600 hover:bg-cyan-700" : "cursor-not-allowed bg-gray-500"
                }`}
                style={{ fontSize: "1.125rem" }} // Optional: Make the button text slightly larger.
              >
                Go To LinkedIn
                <span className="hidden md:inline">&nbsp;Search</span>
                <span className="relative bottom-0.5 ml-2">→</span>
              </a>
            )}
          </div>
        </h2>
        <div className="mt-6">
          <label htmlFor="linkedinUrl" className="mb-1 block text-sm font-semibold text-gray-300">
            LinkedIn Job Search URL
          </label>
          <input
            id="linkedinUrl"
            type="text"
            placeholder="e.g. https://www.linkedin.com/jobs/search?f_WT=2..."
            value={inputURL}
            onChange={handleURLChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
          />
        </div>
        <div className="mt-4">
          <label className="mb-4 block text-sm font-semibold text-gray-300">
            Job Posted In The Last:
            <select
              value={selectedTime}
              onChange={handleTimeChange}
              className="ml-2 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-600"
            >
              <option value="3600">1 Hour</option>
              <option value="14400">4 Hours</option>
              <option value="43200">12 Hours</option>
              <option value="86400">24 Hours</option>
              <option value="259200">3 Days</option>
              <option value="432000">5 Days</option>
              <option value="604800">1 Week</option>
            </select>
          </label>
          <label className="mb-4 block text-sm font-semibold text-gray-300">
            Minimum Salary:
            <select
              value={selectedSalary}
              onChange={handleSalaryChange}
              className="ml-2 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-600"
            >
              <option value="0">None</option>
              <option value="1">$40,000</option>
              <option value="2">$60,000</option>
              <option value="3">$80,000</option>
              <option value="4">$100,000</option>
              <option value="5">$120,000</option>
              <option value="6">$140,000</option>
              <option value="7">$160,000</option>
              <option value="8">$180,000</option>
              <option value="9">$200,000</option>
            </select>
          </label>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-300">Keywords (AND)</h3>
          {keywords.map((value, idx) => (
            <div key={`keyword-${idx}`} className="mb-2 flex items-center">
              <input
                type="text"
                data-keyword-input
                placeholder="Keyword..."
                value={value}
                onChange={(e) => handleKeywordChange(e, idx)}
                onKeyDown={(e) => handleKeywordKeyDown(e, idx)}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
              />
              <button
                onClick={() => removeKeyword(idx)}
                className="ml-2 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 hover:bg-gray-700"
              >
                x
              </button>
            </div>
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
            <div key={`exclusion-${idx}`} className="mb-2 flex items-center">
              <input
                type="text"
                data-exclusion-input
                placeholder="Excluded Company..."
                value={value}
                onChange={(e) => handleExclusionChange(e, idx)}
                onKeyDown={(e) => handleExclusionKeyDown(e, idx)}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600"
              />
              <button
                onClick={() => removeExclusion(idx)}
                className="ml-2 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 hover:bg-gray-700"
              >
                x
              </button>
            </div>
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
            <a
              href={finalURL}
              target="_blank"
              rel="noopener noreferrer"
              className="break-words text-cyan-400 underline"
            >
              {finalURL}
            </a>
          ) : (
            <p className="text-sm text-gray-400">Enter a valid LinkedIn URL to generate a link.</p>
          )}
        </div>
      </div>
    </div>
  );
}
