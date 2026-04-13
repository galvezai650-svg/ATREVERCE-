import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
        quizScores: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        missionProgress: true,
        communityPosts: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        certificates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    // Enrich each user with computed stats
    const enrichedUsers = users.map(user => ({
      ...user,
      _stats: {
        totalQuizScores: user.quizScores.length,
        bestQuizScore: user.quizScores.length > 0 ? Math.max(...user.quizScores.map(q => q.percentage)) : 0,
        totalMissionsCompleted: user.missionProgress.filter(m => m.completed).length,
        totalMissionsStarted: user.missionProgress.length,
        totalCommunityPosts: user.communityPosts.length,
        totalCommunityLikes: user.communityPosts.reduce((sum, p) => sum + p.likes, 0),
        totalCertificates: user.certificates.length,
        totalSubscriptions: user.subscriptions.length,
        approvedSubscriptions: user.subscriptions.filter(s => s.status === 'approved').length,
        pendingSubscriptions: user.subscriptions.filter(s => s.status === 'pending').length,
        lastActivity: [
          user.quizScores[0]?.createdAt,
          user.missionProgress.find(m => m.completed)?.updatedAt,
          user.communityPosts[0]?.createdAt,
          user.certificates[0]?.createdAt,
        ].filter(Boolean).sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null,
      },
    }))

    return NextResponse.json(enrichedUsers)
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}
