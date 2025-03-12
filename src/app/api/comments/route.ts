import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const discussionId = searchParams.get("discussionId")
  const articleId = searchParams.get("articleId")

  if (!discussionId && !articleId) {
    return new NextResponse("Discussion ID or Article ID is required", { status: 400 })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        discussionId: discussionId || undefined,
        articleId: articleId || undefined,
        parentId: null, // Получаем только корневые комментарии
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { content, discussionId, articleId, parentId } = await request.json()

    if (!content) {
      return new NextResponse("Content is required", { status: 400 })
    }

    if (!discussionId && !articleId) {
      return new NextResponse("Discussion ID or Article ID is required", { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        discussionId: discussionId || undefined,
        articleId: articleId || undefined,
        parentId: parentId || undefined,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 