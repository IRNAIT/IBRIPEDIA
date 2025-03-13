import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArticleContent } from "@/components/ArticleContent"
import { Comments } from "@/components/Comments"

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: {
      isPublic: true,
    },
    select: {
      id: true,
    },
  })

  return articles.map((article) => ({
    id: article.id,
  }))
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      editors: true,
      roles: true,
      category: true,
      discussions: {
        include: {
          author: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleContent article={article} />
      <Comments articleId={article.id} />
    </div>
  )
} 