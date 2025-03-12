"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Comments } from "@/components/Comments"

interface Discussion {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    name: string
    image: string
  }
  tags: {
    name: string
  }[]
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

export default function DiscussionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDiscussion = async () => {
    try {
      const response = await fetch(`/api/discussions/${params.id}`)
      if (!response.ok) {
        throw new Error("Не удалось загрузить обсуждение")
      }
      const data = await response.json()
      setDiscussion(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?discussionId=${params.id}`)
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
      await Promise.all([fetchDiscussion(), fetchComments()])
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

  if (error || !discussion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-red-500 mb-4">{error || "Обсуждение не найдено"}</p>
          <Button onClick={() => router.push("/discussions")}>
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
          <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              {discussion.author.image && (
                <img
                  src={discussion.author.image}
                  alt={discussion.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium">{discussion.author.name}</span>
            </div>
            <span className="text-gray-500">
              {new Date(discussion.createdAt).toLocaleDateString("ru-RU")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {discussion.tags.map((tag) => (
              <span
                key={tag.name}
                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: discussion.content }}
          />
        </div>
        <div className="mt-12">
          <Comments
            comments={comments}
            discussionId={discussion.id}
            onCommentAdded={fetchComments}
          />
        </div>
      </div>
    </div>
  )
} 