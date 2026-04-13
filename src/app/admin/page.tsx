'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, CreditCard, Check, X, Clock,
  Crown, ChevronDown, RefreshCw, Search, AlertTriangle,
  UserCheck, UserX, Eye, ArrowLeft, Star
} from 'lucide-react'

// ============================================================
// Admin Panel — /admin
// ============================================================

interface UserData {
  id: string
  email: string
  name: string
  isPremium: boolean
  createdAt: string
  subscriptions: SubscriptionData[]
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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [users, setUsers] = useState<UserData[]>([])
  const [transactions, setTransactions] = useState<SubscriptionData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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
        showToast(!currentState ? '✅ Premium activado' : '❌ Premium desactivado')
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
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Usuarios', value: users.length, icon: Users, color: '#00d4ff' },
            { label: 'Usuarios Premium', value: premiumCount, icon: Crown, color: '#f59e0b' },
            { label: 'Transacciones', value: transactions.length, icon: CreditCard, color: '#10b981' },
            { label: 'Pendientes', value: pendingCount, icon: Clock, color: '#ef4444' },
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
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/30">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setActiveTab('users')}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              background: activeTab === 'users' ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: activeTab === 'users' ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              border: activeTab === 'users' ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
            }}
          >
            <Users size={16} /> Usuarios ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              background: activeTab === 'transactions' ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: activeTab === 'transactions' ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              border: activeTab === 'transactions' ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
            }}
          >
            <CreditCard size={16} /> Transacciones ({transactions.length})
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/20">{pendingCount}</span>
            )}
          </button>
        </div>

        {/* Search (users tab) */}
        {activeTab === 'users' && (
          <div className="relative">
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
        )}

        {/* USERS TAB */}
        <AnimatePresence mode="wait">
          {activeTab === 'users' ? (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
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
                  <p className="text-white/30 text-sm">No hay usuarios registrados</p>
                </div>
              ) : (
                filteredUsers.map((user, i) => (
                  <motion.div
                    key={user.id}
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: user.isPremium ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium truncate">{user.name}</p>
                          {user.isPremium && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/20 flex items-center gap-0.5">
                              <Star size={8} /> PRO
                            </span>
                          )}
                        </div>
                        <p className="text-white/30 text-xs truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-white/20 text-[10px] hidden sm:block">
                          {new Date(user.createdAt).toLocaleDateString('es-CO')}
                        </p>
                        <button
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <motion.div animate={{ rotate: expandedUser === user.id ? 180 : 0 }}>
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>
                        <motion.button
                          onClick={() => togglePremium(user.id, user.isPremium)}
                          disabled={actionLoading === user.id}
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
                    <AnimatePresence>
                      {expandedUser === user.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            <div className="grid grid-cols-3 gap-3 pt-3">
                              <div>
                                <p className="text-[10px] text-white/20">ID</p>
                                <p className="text-xs text-white/50 font-mono truncate">{user.id.slice(0, 12)}...</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/20">Estado</p>
                                <p className="text-xs" style={{ color: user.isPremium ? '#f59e0b' : '#64748b' }}>
                                  {user.isPremium ? '⭐ Premium' : 'Gratuito'}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/20">Suscripciones</p>
                                <p className="text-xs text-white/50">{user.subscriptions.length}</p>
                              </div>
                            </div>
                            {user.subscriptions.length > 0 && (
                              <div className="space-y-1 pt-2">
                                <p className="text-[10px] text-white/20">Historial de suscripciones:</p>
                                {user.subscriptions.map(sub => (
                                  <div key={sub.id} className="flex items-center gap-2 text-[10px]">
                                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                                      sub.status === 'approved' ? 'bg-emerald-400/15 text-emerald-400' :
                                      sub.status === 'rejected' ? 'bg-red-400/15 text-red-400' :
                                      'bg-amber-400/15 text-amber-400'
                                    }`}>
                                      {sub.status === 'approved' ? '✅' : sub.status === 'rejected' ? '❌' : '⏳'} {sub.status}
                                    </span>
                                    <span className="text-white/30">{new Date(sub.createdAt).toLocaleDateString('es-CO')}</span>
                                    <span className="text-white/20">${sub.amount} {sub.currency}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            /* TRANSACTIONS TAB */
            <motion.div key="transactions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
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
                  {/* Pending first */}
                  {transactions.filter(t => t.status === 'pending').length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                        <Clock size={12} /> PENDIENTES DE REVISIÓN ({transactions.filter(t => t.status === 'pending').length})
                      </h3>
                      {transactions.filter(t => t.status === 'pending').map((trans, i) => (
                        <TransactionCard
                          key={trans.id}
                          trans={trans}
                          actionLoading={actionLoading}
                          onApprove={() => reviewTransaction(trans.id, 'approved')}
                          onReject={() => reviewTransaction(trans.id, 'rejected')}
                          index={i}
                        />
                      ))}
                    </div>
                  )}
                  {/* Reviewed */}
                  <div>
                    <h3 className="text-xs font-semibold text-white/30 mb-2 flex items-center gap-1.5">
                      <Eye size={12} /> REVISADAS ({transactions.filter(t => t.status !== 'pending').length})
                    </h3>
                    {transactions.filter(t => t.status !== 'pending').map((trans, i) => (
                      <TransactionCard
                        key={trans.id}
                        trans={trans}
                        actionLoading={actionLoading}
                        onApprove={() => reviewTransaction(trans.id, 'approved')}
                        onReject={() => reviewTransaction(trans.id, 'rejected')}
                        index={i}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
  trans,
  actionLoading,
  onApprove,
  onReject,
  index,
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
          </div>
          <p className="text-white/30 text-xs truncate">{trans.user?.email}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-cyan-400 text-xs font-semibold">${trans.amount} {trans.currency}</span>
            <span className="text-white/20 text-[10px]">{new Date(trans.createdAt).toLocaleDateString('es-CO')}</span>
            {trans.subscriptionId && (
              <span className="text-white/15 text-[10px] font-mono truncate">Sub: {trans.subscriptionId.slice(0, 15)}...</span>
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
