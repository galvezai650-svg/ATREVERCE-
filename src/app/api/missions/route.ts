import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ALL_MISSIONS = [
  { missionId: 'm1', title: 'Observa el cielo nocturno', description: 'Toma una foto del cielo nocturno y compártela', xp: 50, fact: 'La Vía Láctea contiene entre 100-400 mil millones de estrellas.' },
  { missionId: 'm2', title: 'Completa un quiz astronómico', description: 'Termina un cuestionario sobre el espacio', xp: 100, fact: 'El Telescopio Hubble ha tomado más de 1.5 millones de observaciones desde 1990.' },
  { missionId: 'm3', title: 'Explora un planeta', description: 'Visita la página de cualquier planeta y léela completa', xp: 25, fact: 'El Monte Olimpo en Marte es casi 3 veces más alto que el Everest.' },
  { missionId: 'm4', title: 'Usa el simulador de peso', description: 'Calcula tu peso en al menos 3 planetas diferentes', xp: 50, fact: 'Júpiter tiene el día más corto de todos los planetas: solo 10 horas.' },
  { missionId: 'm5', title: 'Comparte en la comunidad', description: 'Publica algo en la sección de comunidad', xp: 75, fact: 'La ISS orbita la Tierra a 28,000 km/h, completando 16 órbitas por día.' },
  { missionId: 'm6', title: 'Aprende sobre una constelación', description: 'Investiga y comparte un dato sobre una constelación', xp: 50, fact: 'Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra.' },
  { missionId: 'm7', title: 'Simulador de gravedad', description: 'Lanza un objeto en el simulador de gravedad', xp: 25, fact: 'Saturno es tan poco denso que flotaría si encontraras una bañera lo suficientemente grande.' },
  { missionId: 'm8', title: 'Lee el dato astronómico', description: 'Lee el dato astronómico del día', xp: 25, fact: 'Neptuno tarda 165 años en dar una vuelta alrededor del Sol.' },
  { missionId: 'm9', title: 'Visita el modelo 3D', description: 'Explora la sección de modelos 3D', xp: 25, fact: 'Los astronautas crecen hasta 5 cm más en el espacio debido a la falta de gravedad.' },
  { missionId: 'm10', title: 'Maestro del universo', description: 'Obtén una puntuación perfecta en cualquier quiz', xp: 150, fact: 'El agujero negro más grande conocido tiene 66 mil millones de veces la masa del Sol.' },
  { missionId: 'night_sky', title: 'Cielo Nocturno', description: 'Mira el cielo nocturno esta noche', xp: 50, fact: 'La Vía Láctea contiene entre 100-400 mil millones de estrellas.' },
  { missionId: 'photo_gallery', title: 'Galería NASA', description: 'Explora 3 fotos de la Galería NASA', xp: 75, fact: 'El Telescopio Hubble ha tomado más de 1.5 millones de observaciones desde 1990.' },
  { missionId: 'moon_phases', title: 'Fase Lunar', description: 'Aprende sobre la Luna', xp: 50, fact: 'La Luna se aleja de la Tierra 3.8 cm cada año.' },
  { missionId: 'community_read', title: 'Lector Social', description: 'Lee 3 publicaciones de la comunidad', xp: 50, fact: 'La ISS orbita la Tierra a 28,000 km/h, completando 16 órbitas por día.' },
  { missionId: 'black_hole', title: 'Agujero Negro', description: 'Aprende sobre los agujeros negros', xp: 75, fact: 'El agujero negro supermasivo en el centro de la Vía Láctea se llama Sagitario A*.' },
  { missionId: 'mars_day', title: 'Día Marciano', description: 'Descubre datos sobre Marte', xp: 50, fact: 'Un día en Marte (sol) dura 24 horas y 37 minutos.' },
  { missionId: 'saturn_rings', title: 'Anillos de Saturno', description: 'Explora los anillos de Saturno', xp: 50, fact: 'Los anillos de Saturno están hechos principalmente de partículas de hielo y roca.' },
  { missionId: 'speed_of_light', title: 'Velocidad de la Luz', description: 'Aprende sobre la velocidad de la luz', xp: 75, fact: 'La luz viaja a 299,792 km/s. Desde el Sol hasta la Tierra tarda 8 minutos y 20 segundos.' },
  { missionId: 'iss_track', title: 'Rastrear la ISS', description: 'Sigue la posición de la Estación Espacial', xp: 75, fact: 'La Estación Espacial Internacional es visible a simple vista como una estrella móvil.' },
  { missionId: 'comet_hunter', title: 'Cazador de Cometas', description: 'Aprende sobre cometas famosos', xp: 50, fact: 'El cometa Halley vuelve a pasar cerca de la Tierra cada 76 años. La próxima será en 2061.' },
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
