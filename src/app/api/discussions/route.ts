import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const discussions = await prisma.discussion.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(discussions)
  } catch (error) {
    console.error("Error fetching discussions:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { title, content, tags } = await request.json()

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: session.user.id,
          },
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: true,
      },
    })

    return NextResponse.json(discussion)
  } catch (error) {
    console.error("Error creating discussion:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 