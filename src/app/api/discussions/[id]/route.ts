import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: {
        id: params.id,
      },
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
      },
    })

    if (!discussion) {
      return new NextResponse("Discussion not found", { status: 404 })
    }

    return NextResponse.json(discussion)
  } catch (error) {
    console.error("Error fetching discussion:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 