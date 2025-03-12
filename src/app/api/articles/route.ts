import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isPublic: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { title, content, isPublic, categoryId } = await request.json()

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        isPublic,
        categoryId: categoryId || undefined,
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

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error creating article:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 