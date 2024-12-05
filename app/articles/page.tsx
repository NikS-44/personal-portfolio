"use client";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  href: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Web Accessibility: Beyond the Basics",
    description:
      "Diving deep into ARIA attributes, keyboard navigation, and creating truly inclusive web experiences. Learn how to make your websites accessible to everyone.",
    date: "12/4/2024",
    readTime: "12 min read",
    href: "/articles/accessibility",
  },
  {
    id: 2,
    title: "Terminal Tips & Tricks: Boosting Your CLI Productivity",
    description:
      "Discover powerful terminal commands, aliases, and customizations that will transform your command-line workflow and make you more efficient.",
    date: "Coming Soon",
    readTime: "6 min read",
    href: "/articles/terminal",
  },
];

const Articles = () => {
  return (
    <div className="mx-auto mb-8 max-w-4xl">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">Latest Articles</h2>
      <div className="mx-2 grid gap-8 md:grid-cols-2">
        {articles.map((post) => (
          <Link
            key={post.id}
            href={post.href}
            className="group rounded-lg border border-cyan-900/30 bg-neutral-900/50 p-6 transition-all duration-300 hover:border-cyan-700/50 hover:bg-neutral-900/80"
          >
            <article className="flex h-full flex-col justify-between">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-cyan-400">{post.title}</h3>
                <p className="mb-4 text-gray-400">{post.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Articles;
