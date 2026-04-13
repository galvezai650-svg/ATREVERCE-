import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ isPremium: false }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ isPremium: false })
    }

    return NextResponse.json({ isPremium: user.isPremium })
  } catch (error) {
    console.error('Check premium error:', error)
    return NextResponse.json({ isPremium: false }, { status: 500 })
  }
}
