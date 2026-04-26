"use client";

import { useParams } from "next/navigation";
import MarkdownArticle from "@/app/components/articles/MarkdownArticle";

const AccountDetailsPage: React.FC = () => {
  const params = useParams();
  let articleId = params.articleId;

  if (Array.isArray(articleId)) {
    articleId = articleId[0];
  }

  return <MarkdownArticle articleId={articleId} />;
};

export default AccountDetailsPage;
