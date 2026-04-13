'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, CreditCard, Check, X, Clock,
  Crown, ChevronDown, RefreshCw, Search, AlertTriangle,
  UserCheck, UserX, Eye, Star, Trash2, Brain,
  Target, MessageSquare, Award, TrendingUp, Activity,
  Zap, BarChart3, CalendarDays, Edit3, Save, Ban
} from 'lucide-react'

// ============================================================
// Admin Panel — /admin
// ============================================================

interface UserStats {
  totalQuizScores: number
  bestQuizScore: number
  totalMissionsCompleted: number
  totalMissionsStarted: number
  totalCommunityPosts: number
  totalCommunityLikes: number
  totalCertificates: number
  totalSubscriptions: number
  approvedSubscriptions: number
  pendingSubscriptions: number
  lastActivity: string | null
}

interface UserData {
  id: string
  email: string
  name: string
  isPremium: boolean
  createdAt: string
  updatedAt: string
  subscriptions: SubscriptionData[]
  _stats: UserStats
}

interface SubscriptionData {
  id: string
  subscriptionId: string | null
  planId: string
  status: string
  amount: number
  currency: string
  createdAt: string
  reviewedAt: string | null
  user: { id: string; name: string; email: string }
}

const ADMIN_PASSWORD = 'astroverse2025'

type Tab = 'overview' | 'users' | 'transactions'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [users, setUsers] = useState<UserData[]>([])
  const [transactions, setTransactions] = useState<SubscriptionData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'premium' | 'free'>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setPasswordError('')
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, transRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/transactions'),
      ])
      const usersData = await usersRes.json()
      const transData = await transRes.json()
      if (Array.isArray(usersData)) setUsers(usersData)
      if (Array.isArray(transData)) setTransactions(transData)
    } catch (err) {
      console.error(err)
      showToast('Error al cargar datos', 'error')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!authenticated) return
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const [usersRes, transRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/transactions'),
        ])
        if (cancelled) return
        const usersData = await usersRes.json()
        const transData = await transRes.json()
        if (cancelled) return
        if (Array.isArray(usersData)) setUsers(usersData)
        if (Array.isArray(transData)) setTransactions(transData)
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          showToast('Error al cargar datos', 'error')
        }
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [authenticated])

  const togglePremium = async (userId: string, currentState: boolean) => {
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPremium: !currentState }),
      })
      if (res.ok) {
        showToast(!currentState ? '✅ PRO activado manualmente (sin PayPal)' : '❌ PRO desactivado')
        fetchData()
      }
    } catch {
      showToast('Error al actualizar', 'error')
    }
    setActionLoading(null)
  }

  const deleteUser = async (userId: string) => {
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('🗑️ Usuario eliminado permanentemente')
        setConfirmDelete(null)
        setExpandedUser(null)
        fetchData()
      }
    } catch {
      showToast('Error al eliminar', 'error')
    }
    setActionLoading(null)
  }

  const startEditUser = (user: UserData) => {
    setEditingUser(user.id)
    setEditName(user.name)
    setEditEmail(user.email)
  }

  const saveEditUser = async (userId: string) => {
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail }),
      })
      if (res.ok) {
        showToast('✅ Usuario actualizado')
        setEditingUser(null)
        fetchData()
      }
    } catch {
      showToast('Error al actualizar', 'error')
    }
    setActionLoading(null)
  }

  const reviewTransaction = async (transId: string, status: 'approved' | 'rejected') => {
    setActionLoading(transId)
    try {
      const res = await fetch(`/api/admin/transactions/${transId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        showToast(status === 'approved' ? '✅ Transacción aprobada' : '❌ Transacción rechazada')
        fetchData()
      }
    } catch {
      showToast('Error al revisar', 'error')
    }
    setActionLoading(null)
  }

  const pendingCount = transactions.filter(t => t.status === 'pending').length
  const premiumCount = users.filter(u => u.isPremium).length
  const freeCount = users.length - premiumCount

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'premium' && u.isPremium) ||
      (filterStatus === 'free' && !u.isPremium)
    return matchesSearch && matchesFilter
  })

  // Global stats for overview
  const totalQuizzes = users.reduce((sum, u) => sum + u._stats.totalQuizScores, 0)
  const totalPosts = users.reduce((sum, u) => sum + u._stats.totalCommunityPosts, 0)
  const totalLikes = users.reduce((sum, u) => sum + u._stats.totalCommunityLikes, 0)
  const totalMissionsDone = users.reduce((sum, u) => sum + u._stats.totalMissionsCompleted, 0)
  const totalCerts = users.reduce((sum, u) => sum + u._stats.totalCertificates, 0)

  // Most active users
  const mostActive = [...users].sort((a, b) => {
    const scoreA = a._stats.totalQuizScores + a._stats.totalCommunityPosts + a._stats.totalMissionsCompleted
    const scoreB = b._stats.totalQuizScores + b._stats.totalCommunityPosts + b._stats.totalMissionsCompleted
    return scoreB - scoreA
  }).slice(0, 5)

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  const fmtRelative = (d: string | null) => {
    if (!d) return 'Nunca'
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 30) return `Hace ${days}d`
    return fmtDate(d)
  }

  // ===== LOGIN SCREEN =====
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#050510' }}>
        <motion.div
          className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: 'rgba(10,10,30,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px)',
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)' }} />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="text-white/40 text-sm mt-1">ASTROVERSE · Control total</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Contraseña de administrador</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError('') }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <AnimatePresence>
              {passwordError && (
                <motion.p className="text-sm text-red-400 flex items-center gap-1.5" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <AlertTriangle size={14} /> {passwordError}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
            >
              <Shield size={16} /> Acceder al Panel
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // ===== ADMIN DASHBOARD =====
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: toast.type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
              color: toast.type === 'success' ? '#10b981' : '#ef4444',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: 'rgba(5,5,16,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-[10px] text-white/30 tracking-wider">ASTROVERSE ADMINISTRACIÓN</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Clock size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">{pendingCount} pendientes</span>
              </motion.div>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Big Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Usuarios', value: users.length, icon: Users, color: '#00d4ff', sub: `${premiumCount} PRO · ${freeCount} Free` },
                { label: 'Transacciones', value: transactions.length, icon: CreditCard, color: '#10b981', sub: `${pendingCount} pendientes` },
                { label: 'Actividad Total', value: totalQuizzes + totalPosts + totalMissionsDone, icon: Activity, color: '#f59e0b', sub: `${totalQuizzes} quiz · ${totalPosts} posts` },
                { label: 'Certificados', value: totalCerts, icon: Award, color: '#ec4899', sub: 'Emitidos en total' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-[10px] text-white/30">{stat.label}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-white/20 mt-2">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Platform Activity Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Platform Stats */}
              <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Actividad de la Plataforma</h3>
                </div>
                {[
                  { label: 'Quizzes completados', value: totalQuizzes, icon: Brain, color: '#7c3aed' },
                  { label: 'Misiones completadas', value: totalMissionsDone, icon: Target, color: '#10b981' },
                  { label: 'Posts en comunidad', value: totalPosts, icon: MessageSquare, color: '#00d4ff' },
                  { label: 'Likes totales', value: totalLikes, icon: Zap, color: '#f59e0b' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}12` }}>
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-white/60">{item.label}</p>
                        <p className="text-sm font-bold text-white">{item.value}</p>
                      </div>
                      <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (item.value / Math.max(1, users.length * 5)) * 100)}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Most Active Users */}
              <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Usuarios Más Activos</h3>
                </div>
                {mostActive.length === 0 ? (
                  <p className="text-white/20 text-xs text-center py-4">Sin actividad registrada</p>
                ) : (
                  mostActive.map((user, i) => {
                    const activityScore = user._stats.totalQuizScores + user._stats.totalCommunityPosts + user._stats.totalMissionsCompleted
                    return (
                      <motion.div
                        key={user.id}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{
                          background: i === 0 ? 'rgba(245,158,11,0.15)' : i === 1 ? 'rgba(148,163,184,0.15)' : i === 2 ? 'rgba(180,83,9,0.15)' : 'rgba(255,255,255,0.05)',
                          color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#64748b',
                        }}>
                          #{i + 1}
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: user.isPremium ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-white font-medium truncate">{user.name}</p>
                            {user.isPremium && <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-white/20 truncate">{user.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-cyan-400">{activityScore}</p>
                          <p className="text-[9px] text-white/15">actividad</p>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Pending Transactions Quick View */}
            {pendingCount > 0 && (
              <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.12)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-400" />
                    <h3 className="text-sm font-semibold text-amber-400">Transacciones Pendientes ({pendingCount})</h3>
                  </div>
                  <button onClick={() => setActiveTab('transactions')} className="text-[10px] text-cyan-400 hover:underline">Ver todas →</button>
                </div>
                {transactions.filter(t => t.status === 'pending').slice(0, 3).map(trans => (
                  <div key={trans.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.05)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                      <Clock size={14} className="text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">{trans.user?.name || 'Desconocido'}</p>
                      <p className="text-[10px] text-white/30">{trans.user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-cyan-400">${trans.amount}</span>
                      <span className="text-[9px] text-white/20">{fmtDate(trans.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => reviewTransaction(trans.id, 'approved')} className="w-7 h-7 rounded-md flex items-center justify-center text-emerald-400 hover:bg-emerald-400/10 transition-all" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Check size={12} />
                      </button>
                      <button onClick={() => reviewTransaction(trans.id, 'rejected')} className="w-7 h-7 rounded-md flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-all" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ===== USERS TAB ===== */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-white/20"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'premium', 'free'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filterStatus === f ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                      border: filterStatus === f ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      color: filterStatus === f ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {f === 'all' ? `Todos (${users.length})` : f === 'premium' ? `⭐ PRO (${premiumCount})` : `Free (${freeCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Users List */}
            {loading && users.length === 0 ? (
              <div className="text-center py-16">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <RefreshCw size={24} className="text-cyan-400 mx-auto" />
                </motion.div>
                <p className="text-white/30 text-sm mt-3">Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users size={32} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No se encontraron usuarios</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user, i) => (
                  <motion.div
                    key={user.id}
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    {/* User Row */}
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 relative" style={{ background: user.isPremium ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        {user.name.charAt(0).toUpperCase()}
                        {user._stats.lastActivity && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#0a0a14' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingUser === user.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="px-2 py-1 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <input
                              value={editEmail}
                              onChange={e => setEditEmail(e.target.value)}
                              className="px-2 py-1 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium truncate">{user.name}</p>
                              {user.isPremium && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/20 flex items-center gap-0.5">
                                  <Star size={8} /> PRO
                                </span>
                              )}
                            </div>
                            <p className="text-white/30 text-xs truncate">{user.email}</p>
                          </>
                        )}
                      </div>

                      {/* Quick Stats Badges */}
                      <div className="hidden md:flex items-center gap-2 shrink-0">
                        {user._stats.totalQuizScores > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
                            <Brain size={10} className="text-violet-400" />
                            <span className="text-[9px] text-violet-400 font-medium">{user._stats.totalQuizScores}</span>
                          </div>
                        )}
                        {user._stats.totalCommunityPosts > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                            <MessageSquare size={10} className="text-cyan-400" />
                            <span className="text-[9px] text-cyan-400 font-medium">{user._stats.totalCommunityPosts}</span>
                          </div>
                        )}
                        {user._stats.totalCertificates > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
                            <Award size={10} className="text-pink-400" />
                            <span className="text-[9px] text-pink-400 font-medium">{user._stats.totalCertificates}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <p className="text-white/20 text-[10px] hidden sm:block">{fmtDate(user.createdAt)}</p>

                        {/* Edit button */}
                        {editingUser === user.id ? (
                          <button onClick={() => saveEditUser(user.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-400/10 transition-all" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
                            {actionLoading === user.id ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                          </button>
                        ) : (
                          <button onClick={() => startEditUser(user)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-cyan-400 hover:bg-white/10 transition-all">
                            <Edit3 size={14} />
                          </button>
                        )}

                        {/* Expand button */}
                        <button onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
                          <motion.div animate={{ rotate: expandedUser === user.id ? 180 : 0 }}>
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>

                        {/* PRO Toggle */}
                        <motion.button
                          onClick={() => togglePremium(user.id, user.isPremium)}
                          disabled={actionLoading === user.id || editingUser === user.id}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                          style={{
                            background: user.isPremium ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                            border: user.isPremium ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(16,185,129,0.2)',
                            color: user.isPremium ? '#ef4444' : '#10b981',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {actionLoading === user.id ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : user.isPremium ? (
                            <><UserX size={12} /> Quitar PRO</>
                          ) : (
                            <><UserCheck size={12} /> Dar PRO</>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded User Details */}
                    <AnimatePresence>
                      {expandedUser === user.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            {/* User Info Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                              <div>
                                <p className="text-[10px] text-white/20">ID</p>
                                <p className="text-xs text-white/50 font-mono truncate">{user.id.slice(0, 16)}...</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/20">Estado</p>
                                <p className="text-xs flex items-center gap-1" style={{ color: user.isPremium ? '#f59e0b' : '#64748b' }}>
                                  {user.isPremium ? <Star size={10} className="fill-amber-400" /> : <Ban size={10} />}
                                  {user.isPremium ? 'Premium Activo' : 'Gratuito'}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/20">Registrado</p>
                                <p className="text-xs text-white/50">{fmtDate(user.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/20">Última Actividad</p>
                                <p className="text-xs text-white/50">{fmtRelative(user._stats.lastActivity)}</p>
                              </div>
                            </div>

                            {/* Activity Stats */}
                            <div>
                              <p className="text-[10px] text-white/20 mb-2">📊 Actividad del Usuario</p>
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {[
                                  { label: 'Quizzes', value: user._stats.totalQuizScores, icon: Brain, color: '#7c3aed', extra: user._stats.bestQuizScore > 0 ? `Mejor: ${user._stats.bestQuizScore}%` : '' },
                                  { label: 'Misiones', value: user._stats.totalMissionsCompleted, icon: Target, color: '#10b981', extra: `de ${user._stats.totalMissionsStarted}` },
                                  { label: 'Posts', value: user._stats.totalCommunityPosts, icon: MessageSquare, color: '#00d4ff', extra: `${user._stats.totalCommunityLikes} likes` },
                                  { label: 'Certs', value: user._stats.totalCertificates, icon: Award, color: '#ec4899', extra: '' },
                                  { label: 'Subs', value: user._stats.totalSubscriptions, icon: CreditCard, color: '#f59e0b', extra: `${user._stats.approvedSubscriptions} ok` },
                                  { label: 'Score', value: user._stats.totalQuizScores + user._stats.totalCommunityPosts + user._stats.totalMissionsCompleted, icon: Activity, color: '#00d4ff', extra: 'total' },
                                ].map((item, idx) => (
                                  <div key={idx} className="rounded-lg p-2.5 text-center" style={{ background: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                                    <item.icon size={14} style={{ color: item.color }} className="mx-auto mb-1" />
                                    <p className="text-lg font-bold text-white">{item.value}</p>
                                    <p className="text-[9px] text-white/30">{item.label}</p>
                                    {item.extra && <p className="text-[8px] text-white/15 mt-0.5">{item.extra}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Subscriptions History */}
                            {user.subscriptions.length > 0 && (
                              <div>
                                <p className="text-[10px] text-white/20 mb-2">💳 Historial de Suscripciones</p>
                                <div className="space-y-1">
                                  {user.subscriptions.map(sub => (
                                    <div key={sub.id} className="flex items-center gap-2 text-[10px] p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                                        sub.status === 'approved' ? 'bg-emerald-400/15 text-emerald-400' :
                                        sub.status === 'rejected' ? 'bg-red-400/15 text-red-400' :
                                        'bg-amber-400/15 text-amber-400'
                                      }`}>
                                        {sub.status === 'approved' ? '✅' : sub.status === 'rejected' ? '❌' : '⏳'} {sub.status}
                                      </span>
                                      <span className="text-white/30">{fmtDate(sub.createdAt)}</span>
                                      <span className="text-white/20">${sub.amount} {sub.currency}</span>
                                      {sub.planId === 'ADMIN_MANUAL' && (
                                        <span className="px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-bold">ADMIN</span>
                                      )}
                                      {sub.subscriptionId && (
                                        <span className="text-white/15 font-mono truncate ml-auto">PayPal: {sub.subscriptionId.slice(0, 18)}...</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Delete User */}
                            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                              <div>
                                <p className="text-[10px] text-white/20">⚠️ Zona de peligro</p>
                                <p className="text-[9px] text-white/10">Esta acción no se puede deshacer</p>
                              </div>
                              {confirmDelete === user.id ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-red-400">¿Estás seguro?</span>
                                  <button onClick={() => deleteUser(user.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-red-400 transition-all" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    {actionLoading === user.id ? <RefreshCw size={10} className="animate-spin" /> : <Trash2 size={10} />} Eliminar
                                  </button>
                                  <button onClick={() => setConfirmDelete(null)} className="px-2 py-1.5 rounded-lg text-[10px] text-white/30 hover:text-white transition-all" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancelar</button>
                                </div>
                              ) : (
                                <button onClick={() => setConfirmDelete(user.id)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-red-400/50 hover:text-red-400 transition-all" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                  <Trash2 size={10} /> Eliminar Usuario
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ===== TRANSACTIONS TAB ===== */}
        {activeTab === 'transactions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {loading && transactions.length === 0 ? (
              <div className="text-center py-16">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <RefreshCw size={24} className="text-cyan-400 mx-auto" />
                </motion.div>
                <p className="text-white/30 text-sm mt-3">Cargando transacciones...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <CreditCard size={32} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No hay transacciones</p>
              </div>
            ) : (
              <>
                {transactions.filter(t => t.status === 'pending').length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                      <Clock size={12} /> PENDIENTES DE REVISIÓN ({transactions.filter(t => t.status === 'pending').length})
                    </h3>
                    {transactions.filter(t => t.status === 'pending').map((trans, i) => (
                      <TransactionCard key={trans.id} trans={trans} actionLoading={actionLoading} onApprove={() => reviewTransaction(trans.id, 'approved')} onReject={() => reviewTransaction(trans.id, 'rejected')} index={i} />
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-semibold text-white/30 mb-2 flex items-center gap-1.5">
                    <Eye size={12} /> REVISADAS ({transactions.filter(t => t.status !== 'pending').length})
                  </h3>
                  {transactions.filter(t => t.status !== 'pending').map((trans, i) => (
                    <TransactionCard key={trans.id} trans={trans} actionLoading={actionLoading} onApprove={() => reviewTransaction(trans.id, 'approved')} onReject={() => reviewTransaction(trans.id, 'rejected')} index={i} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <div className="flex gap-2 p-1 rounded-xl sticky bottom-4" style={{ background: 'rgba(5,5,16,0.95)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          {[
            { id: 'overview' as Tab, label: 'Resumen', icon: BarChart3, count: null },
            { id: 'users' as Tab, label: 'Usuarios', icon: Users, count: users.length },
            { id: 'transactions' as Tab, label: 'Transacciones', icon: CreditCard, count: pendingCount > 0 ? pendingCount : null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
              style={{
                background: activeTab === tab.id ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: activeTab === tab.id ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                border: activeTab === tab.id ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              }}
            >
              <tab.icon size={16} /> {tab.label}
              {tab.count !== null && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  activeTab === tab.id ? 'bg-cyan-400/15 text-cyan-400' : tab.count > 0 ? 'bg-amber-400/15 text-amber-400' : 'bg-white/5 text-white/20'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[10px] text-white/20">ASTROVERSE Admin Panel · Protegido con contraseña</p>
        </div>
      </main>
    </div>
  )
}

// Transaction Card Component
function TransactionCard({
  trans, actionLoading, onApprove, onReject, index
}: {
  trans: SubscriptionData
  actionLoading: string | null
  onApprove: () => void
  onReject: () => void
  index: number
}) {
  const isPending = trans.status === 'pending'
  return (
    <motion.div
      className="rounded-xl p-4"
      style={{
        background: isPending ? 'rgba(245,158,11,0.03)' : 'rgba(255,255,255,0.02)',
        border: isPending ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(255,255,255,0.06)',
      }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
          background: isPending ? 'rgba(245,158,11,0.1)' :
                     trans.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: isPending ? '1px solid rgba(245,158,11,0.2)' :
                  trans.status === 'approved' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
        }}>
          {isPending ? <Clock size={18} className="text-amber-400" /> :
           trans.status === 'approved' ? <Check size={18} className="text-emerald-400" /> :
           <X size={18} className="text-red-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-medium truncate">{trans.user?.name || 'Desconocido'}</p>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
              isPending ? 'bg-amber-400/15 text-amber-400' :
              trans.status === 'approved' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'
            }`}>
              {isPending ? 'PENDIENTE' : trans.status === 'approved' ? 'APROBADA' : 'RECHAZADA'}
            </span>
            {trans.planId === 'ADMIN_MANUAL' && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">ADMIN</span>
            )}
          </div>
          <p className="text-white/30 text-xs truncate">{trans.user?.email}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-cyan-400 text-xs font-semibold">${trans.amount} {trans.currency}</span>
            <span className="text-white/20 text-[10px]">{new Date(trans.createdAt).toLocaleDateString('es-CO')}</span>
            {trans.subscriptionId && (
              <span className="text-white/15 text-[10px] font-mono truncate">PayPal: {trans.subscriptionId.slice(0, 15)}...</span>
            )}
          </div>
        </div>
        {isPending && (
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              onClick={onApprove}
              disabled={!!actionLoading}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-emerald-400"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {actionLoading === trans.id ? <RefreshCw size={12} className="animate-spin" /> : <><Check size={12} /> Aprobar</>}
            </motion.button>
            <motion.button
              onClick={onReject}
              disabled={!!actionLoading}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {actionLoading === trans.id ? <RefreshCw size={12} className="animate-spin" /> : <><X size={12} /> Rechazar</>}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
