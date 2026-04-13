import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const scores = await db.quizScore.findMany({
      orderBy: { score: 'desc' },
      take: 50,
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    const result = scores.map((s) => ({
      ...s,
      userName: s.user.name,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Quiz scores GET error:', error)
    return NextResponse.json({ error: 'Error al obtener puntuaciones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, score, correctCount, totalQuestions, bestStreak, grade, percentage } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }

    const quizScore = await db.quizScore.create({
      data: {
        userId,
        score: score ?? 0,
        correctCount: correctCount ?? 0,
        totalQuestions: totalQuestions ?? 0,
        bestStreak: bestStreak ?? 0,
        grade: grade ?? 'Explorador Novato',
        percentage: percentage ?? 0,
      },
    })

    return NextResponse.json(quizScore, { status: 201 })
  } catch (error) {
    console.error('Quiz scores POST error:', error)
    return NextResponse.json({ error: 'Error al guardar puntuación' }, { status: 500 })
  }
}
