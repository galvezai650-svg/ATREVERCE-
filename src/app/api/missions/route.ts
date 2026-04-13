import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ALL_MISSIONS = [
  { missionId: 'm1', title: 'Observa el cielo nocturno', description: 'Toma una foto del cielo nocturno y compártela', xp: 50 },
  { missionId: 'm2', title: 'Completa un quiz astronómico', description: 'Termina un cuestionario sobre el espacio', xp: 100 },
  { missionId: 'm3', title: 'Explora un planeta', description: 'Visita la página de cualquier planeta y léela completa', xp: 30 },
  { missionId: 'm4', title: 'Usa el simulador de peso', description: 'Calcula tu peso en al menos 3 planetas diferentes', xp: 40 },
  { missionId: 'm5', title: 'Comparte en la comunidad', description: 'Publica algo en la sección de comunidad', xp: 60 },
  { missionId: 'm6', title: 'Aprende sobre una constelación', description: 'Investiga y comparte un dato sobre una constelación', xp: 45 },
  { missionId: 'm7', title: 'Simulador de gravedad', description: 'Lanza un objeto en el simulador de gravedad', xp: 35 },
  { missionId: 'm8', title: 'Lee el dato astronómico', description: 'Lee el dato astronómico del día', xp: 20 },
  { missionId: 'm9', title: 'Visita el modelo 3D', description: 'Explora la sección de modelos 3D', xp: 30 },
  { missionId: 'm10', title: 'Maestro del universo', description: 'Obtén una puntuación perfecta en cualquier quiz', xp: 150 },
]

function getDailyMissions(): typeof ALL_MISSIONS {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  const startIndex = dayOfYear % ALL_MISSIONS.length
  const missions: typeof ALL_MISSIONS = []
  for (let i = 0; i < 5; i++) {
    missions.push(ALL_MISSIONS[(startIndex + i) % ALL_MISSIONS.length])
  }
  return missions
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')

    const dailyMissions = getDailyMissions()

    if (!userId) {
      return NextResponse.json(
        dailyMissions.map((m) => ({ ...m, completed: false, progress: 0 }))
      )
    }

    const progress = await db.missionProgress.findMany({
      where: { userId },
    })

    const progressMap = new Map(progress.map((p) => [p.missionId, p]))

    const result = dailyMissions.map((m) => {
      const p = progressMap.get(m.missionId)
      return {
        ...m,
        completed: p?.completed ?? false,
        progress: p?.progress ?? 0,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Missions GET error:', error)
    return NextResponse.json({ error: 'Error al obtener misiones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, missionId, progress, completed } = body

    if (!userId || !missionId) {
      return NextResponse.json(
        { error: 'userId y missionId son requeridos' },
        { status: 400 }
      )
    }

    const missionProgress = await db.missionProgress.upsert({
      where: {
        userId_missionId: { userId, missionId },
      },
      update: {
        ...(progress !== undefined && { progress }),
        ...(completed !== undefined && { completed }),
      },
      create: {
        userId,
        missionId,
        progress: progress ?? 0,
        completed: completed ?? false,
      },
    })

    return NextResponse.json(missionProgress)
  } catch (error) {
    console.error('Missions POST error:', error)
    return NextResponse.json({ error: 'Error al guardar progreso' }, { status: 500 })
  }
}
