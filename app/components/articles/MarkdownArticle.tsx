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
    <div className="flex justify-center">
      <div className="mx-3 mb-8 min-h-96 w-full max-w-screen-xl rounded-lg border border-cyan-900/30 bg-neutral-900/50 p-10 text-white xl:px-40">
        <ReactMarkdown
          components={{
            // Headings
            h1: ({ children }) => <h1 className="my-4 mb-10 text-4xl font-bold">{children}</h1>,
            h2: ({ children }) => (
              <h2 className="my-8 border-b border-current pb-1 text-3xl font-semibold">{children}</h2>
            ),
            h3: ({ children }) => <h3 className="my-6 text-xl font-semibold underline">{children}</h3>,
            h4: ({ children }) => <h4 className="my-4 text-lg font-semibold">{children}</h4>,

            // Paragraphs
            p: ({ children }) => <p className="mb-8 text-lg leading-relaxed">{children}</p>,

            // Lists
            ul: ({ children }) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
            li: ({ children }) => <li className="mb-4">{children}</li>,

            // Links
            a: ({ href, children }) => (
              <a href={href} className="text-cyan-400 underline hover:text-cyan-300">
                {children}
              </a>
            ),

            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-cyan-500 pl-4 italic">{children}</blockquote>
            ),

            // Tables
            table: ({ children }) => (
              <table className="mb-4 w-full border-collapse border border-gray-600">{children}</table>
            ),
            th: ({ children }) => <th className="border border-gray-600 bg-gray-800 p-2 text-left">{children}</th>,
            td: ({ children }) => <td className="border border-gray-600 p-2">{children}</td>,

            // Horizontal Rule
            hr: () => <hr className="my-4 border-gray-600" />,

            // Strong and Emphasis
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownArticle;
