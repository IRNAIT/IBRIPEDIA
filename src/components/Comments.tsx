"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

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

interface CommentsProps {
  comments: Comment[]
  discussionId?: string
  articleId?: string
  onCommentAdded: () => void
}

export function Comments({ comments, discussionId, articleId, onCommentAdded }: CommentsProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          discussionId,
          articleId,
          parentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить комментарий")
      }

      setContent("")
      setReplyTo(null)
      onCommentAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderComment = (comment: Comment, level = 0) => {
    return (
      <div
        key={comment.id}
        className={`mb-4 ${level > 0 ? "ml-8 border-l-2 pl-4" : ""}`}
      >
        <div className="flex items-start gap-4 mb-2">
          {comment.author.image && (
            <img
              src={comment.author.image}
              alt={comment.author.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: ru,
                })}
              </span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: comment.content }} />
            </div>
            {session && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setReplyTo(comment.id)}
              >
                Ответить
              </Button>
            )}
            {replyTo === comment.id && (
              <form
                onSubmit={(e) => handleSubmit(e, comment.id)}
                className="mt-4"
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  placeholder="Напишите ответ..."
                  required
                />
                <div className="flex gap-2 mt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Отправка..." : "Ответить"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setReplyTo(null)
                      setContent("")
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        {comment.replies?.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Комментарии</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      {session ? (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
            placeholder="Напишите комментарий..."
            required
          />
          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 border rounded-md p-4 mb-8 text-center">
          <p className="text-gray-600 mb-2">
            Войдите, чтобы оставить комментарий
          </p>
          <Button onClick={() => signIn()}>Войти</Button>
        </div>
      )}
      <div className="space-y-6">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  )
} 