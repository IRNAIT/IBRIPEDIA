"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Comments } from "@/components/Comments"

interface Article {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    name: string
    image: string
  }
  category?: {
    name: string
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string
    image: string
  }
  replies: Comment[]
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`)
      if (!response.ok) {
        throw new Error("Не удалось загрузить статью")
      }
      const data = await response.json()
      setArticle(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?articleId=${params.id}`)
      if (!response.ok) {
        throw new Error("Не удалось загрузить комментарии")
      }
      const data = await response.json()
      setComments(data)
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchArticle(), fetchComments()])
      setIsLoading(false)
    }
    loadData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-red-500 mb-4">{error || "Статья не найдена"}</p>
          <Button onClick={() => router.push("/articles")}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              {article.author.image && (
                <img
                  src={article.author.image}
                  alt={article.author.name}
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
        <div className="mt-12">
          <Comments
            comments={comments}
            articleId={article.id}
            onCommentAdded={fetchComments}
          />
        </div>
      </div>
    </div>
  )
} 