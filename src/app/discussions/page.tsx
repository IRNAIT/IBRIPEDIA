"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface Discussion {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    name: string
    image: string
  }
  _count: {
    comments: number
  }
  tags: {
    name: string
  }[]
  isPinned: boolean
}

export default function DiscussionsPage() {
  const { data: session } = useSession()
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/discussions")
        if (!response.ok) {
          throw new Error("Не удалось загрузить обсуждения")
        }
        const data = await response.json()
        setDiscussions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscussions()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-end mb-8">
        {session && (
          <Link href="/discussions/new">
            <Button>Создать обсуждение</Button>
          </Link>
        )}
      </div>

      {discussions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Пока нет обсуждений</p>
          {session && (
            <Link href="/discussions/new">
              <Button>Создать первое обсуждение</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {discussions
            .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
            .map((discussion) => (
              <div
                key={discussion.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white/5 backdrop-blur-sm"
              >
                {discussion.isPinned && (
                  <div className="text-primary text-sm mb-2">📌 Закреплено</div>
                )}
                <h2 className="text-2xl font-semibold mb-2">
                  <Link
                    href={`/discussions/${discussion.id}`}
                    className="hover:text-primary"
                  >
                    {discussion.title}
                  </Link>
                </h2>
                <p className="text-gray-400 mb-4">
                  {discussion.content.substring(0, 200)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {discussion.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {discussion.author.image && (
                      <img
                        src={discussion.author.image}
                        alt={discussion.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{discussion.author.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>
                      {new Date(discussion.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                    <span>💬 {discussion._count.comments}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
} 