import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }

    const certificates = await db.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    const result = certificates.map((c) => ({
      ...c,
      userName: c.user.name,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Certificates GET error:', error)
    return NextResponse.json({ error: 'Error al obtener certificados' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseName, description } = body

    if (!userId || !courseName) {
      return NextResponse.json(
        { error: 'userId y courseName son requeridos' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    if (!user.isPremium) {
      return NextResponse.json(
        { error: 'Solo usuarios premium pueden generar certificados' },
        { status: 403 }
      )
    }

    const timestampShort = Date.now().toString(36).toUpperCase()
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
    const certificateId = `AV-${timestampShort}-${randomChars}`

    const certificate = await db.certificate.create({
      data: {
        userId,
        courseName,
        certificateId,
        description: description ?? '',
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({ ...certificate, userName: certificate.user.name }, { status: 201 })
  } catch (error) {
    console.error('Certificates POST error:', error)
    return NextResponse.json({ error: 'Error al crear certificado' }, { status: 500 })
  }
}
