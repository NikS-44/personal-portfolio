"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownArticleProps {
  articleId: string;
}

const MarkdownArticle: React.FC<MarkdownArticleProps> = ({ articleId }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const response = await import(`@/app/components/articles/markdown/${articleId}.md`);
        setContent(response.default);
      } catch (error) {
        console.error("Error loading markdown file:", error);
        setContent("Error loading article content");
      }
    };

    loadMarkdownContent();
  }, [articleId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a2c] to-[#001824] py-16">
      <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cyan-900/20 bg-[#0a1929] p-6 shadow-2xl md:p-10">
          <header className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-cyan-400 md:text-5xl">
              {content.split("\n")[0]}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-neutral-400">
              <div>By Nik Shah</div>
            </div>
          </header>
          <div className="prose prose-lg prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Headings
                h1: ({}) => null,
                h2: ({ children }) => (
                  <h2 className="mb-6 mt-16 text-2xl font-semibold text-white md:text-3xl">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-4 mt-12 text-xl font-semibold text-white/90 md:text-2xl">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="mb-4 mt-8 text-lg font-semibold text-white/90 md:text-xl">{children}</h4>
                ),

                // Paragraphs
                p: ({ children }) => <p className="mb-6 text-lg leading-relaxed text-neutral-300">{children}</p>,

                // Lists
                ul: ({ children }) => <ul className="mb-8 ml-6 list-disc space-y-3">{children}</ul>,
                ol: ({ children }) => <ol className="mb-8 ml-6 list-decimal space-y-3">{children}</ol>,
                li: ({ children }) => <li className="text-lg text-neutral-300">{children}</li>,

                // Code blocks
                code: ({ className, children }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;

                  if (isInline) {
                    return (
                      <code className="rounded-md bg-[#001824] px-2 py-0.5 text-[0.9em] text-cyan-400">{children}</code>
                    );
                  }

                  return (
                    <pre className="my-8 overflow-x-auto rounded-xl border border-cyan-900/20 bg-[#001824] p-6">
                      <code className={`text-cyan-400 ${className} text-[0.9em]`}>{children}</code>
                    </pre>
                  );
                },

                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="my-8 rounded-r-xl border-l-4 border-cyan-500 bg-[#001824] py-6 pl-6 pr-6 text-xl italic text-neutral-300">
                    {children}
                  </blockquote>
                ),

                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-cyan-400 underline decoration-cyan-400/30 transition-all hover:decoration-cyan-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),

                // Tables
                table: ({ children }) => (
                  <div className="my-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-cyan-900/20">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-cyan-900/20 bg-[#001824] p-4 text-left font-semibold text-white">
                    {children}
                  </th>
                ),
                td: ({ children }) => <td className="border border-cyan-900/20 p-4 text-neutral-300">{children}</td>,

                // Horizontal Rule
                hr: () => <hr className="my-12 border-cyan-900/20" />,

                // Strong and Emphasis
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-neutral-200">{children}</em>,
              }}
            >
              {content.split("\n").slice(1).join("\n")}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
};

export default MarkdownArticle;
