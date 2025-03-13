"use client"

import { Article, User, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ArticleContentProps {
  article: Article & {
    author: User
    editors: User[]
    category: Category | null
  }
}

export function ArticleContent({ article }: ArticleContentProps) {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            {article.author.image && (
              <img
                src={article.author.image}
                alt={article.author.name || ""}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">{article.author.name}</span>
          </div>
          <span className="text-gray-500">
            {new Date(article.createdAt).toLocaleDateString("ru-RU")}
          </span>
          {article.category && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
              {article.category.name}
            </span>
          )}
        </div>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  )
} 