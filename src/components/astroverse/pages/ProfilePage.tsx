'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Heart, Star, FlaskConical, Clock, Compass,
  Cpu, Crown, Edit3, Save, Activity,
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// ProfilePage
// ============================================================
export default function ProfilePage({ userName, userEmail, isPremium }: { userName: string; userEmail: string; isPremium?: boolean }) {
  const [prefs, setPrefs] = useState({ email: true, darkMode: true, animations: true })
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(userName)
  const [editEmail, setEditEmail] = useState(userEmail)

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    const labels: Record<keyof typeof prefs, string> = { email: 'Notificaciones', darkMode: 'Modo oscuro', animations: 'Animaciones' }
    toast.success(`${labels[key]} ${!prefs[key] ? 'activado' : 'desactivado'}`)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast.success('Perfil actualizado correctamente')
  }

  const recentActivity = [
    { action: 'Viste "El Sistema Solar"', time: 'Hace 2 horas', icon: Play, color: '#00d4ff' },
    { action: 'Usaste el Simulador de Gravedad', time: 'Hace 5 horas', icon: FlaskConical, color: '#f59e0b' },
    { action: 'Añadiste Júpiter a favoritos', time: 'Ayer', icon: Heart, color: '#ec4899' },
    { action: 'Calculaste tu edad en Marte', time: 'Hace 2 días', icon: Clock, color: '#a78bfa' },
    { action: 'Exploraste la Nebulosa de Orión', time: 'Hace 3 días', icon: Compass, color: '#10b981' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-white/40">Gestiona tu cuenta y preferencias</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div
          className="rounded-2xl p-8 text-center relative overflow-hidden backdrop-blur-xl"
          style={cardBase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)" />
          {/* Gradient border for avatar */}
          <div
            className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899)',
              padding: '3px',
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: '#050510' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                className="space-y-3"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.97] shimmer"
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                      color: 'white',
                      boxShadow: '0 0 20px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Save size={14} />
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg text-sm transition-all duration-200 active:scale-[0.97]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xl font-bold text-white">{userName}</h2>
                <p className="text-white/40 text-sm mt-1">{userEmail}</p>
                <p className="text-white/20 text-xs mt-2">Miembro desde Enero 2025</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
                >
                  <Edit3 size={14} />
                  Editar Perfil
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium badge */}
          <div
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: isPremium ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
              border: isPremium ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.1)',
              color: isPremium ? '#f59e0b' : 'rgba(255,255,255,0.4)',
              boxShadow: isPremium ? '0 0 12px rgba(245,158,11,0.15)' : 'none',
            }}
          >
            <Crown size={12} />
            {isPremium ? 'Plan Premium' : 'Plan Básico'}
          </div>
        </motion.div>

        {/* Stats and info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { label: 'Favoritos', value: '12', icon: Heart, color: '#ec4899' },
              { label: 'Videos Vistos', value: '34', icon: Play, color: '#00d4ff' },
              { label: 'Simulaciones', value: '56', icon: Cpu, color: '#f59e0b' },
              { label: 'Logros', value: '8', icon: Star, color: '#7c3aed' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm cursor-default"
                style={{ ...cardBase }}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                onHoverStart={e => {
                  if (e.currentTarget) {
                    e.currentTarget.style.borderColor = `${stat.color}30`
                    e.currentTarget.style.boxShadow = `0 0 20px ${stat.color}10`
                  }
                }}
                onHoverEnd={e => {
                  if (e.currentTarget) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}10` }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-white/30 text-xs">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Preferences */}
          <motion.div
            className="rounded-2xl p-6 backdrop-blur-xl relative"
            style={cardBase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardGradientTop color="linear-gradient(90deg, #00d4ff, transparent)" />
            <h3 className="text-white font-semibold mb-4">Preferencias</h3>
            <div className="space-y-4">
              {[
                { key: 'email' as const, label: 'Notificaciones por email', desc: 'Recibe actualizaciones sobre nuevo contenido' },
                { key: 'darkMode' as const, label: 'Modo oscuro', desc: 'Tema oscuro para la interfaz' },
                { key: 'animations' as const, label: 'Animaciones', desc: 'Efectos visuales y animaciones' },
              ].map(pref => (
                <div key={pref.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{pref.label}</p>
                    <p className="text-white/30 text-xs">{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => togglePref(pref.key)}
                    className="w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 active:scale-95"
                    style={{
                      background: prefs[pref.key] ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                      boxShadow: prefs[pref.key] ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
                    }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full toggle-dot"
                      style={{
                        background: prefs[pref.key] ? '#00d4ff' : 'rgba(255,255,255,0.3)',
                        left: prefs[pref.key] ? '24px' : '4px',
                        boxShadow: prefs[pref.key] ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity / Historial */}
          <motion.div
            className="rounded-2xl p-6 backdrop-blur-xl relative"
            style={cardBase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardGradientTop color="linear-gradient(90deg, #10b981, transparent)" />
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              Historial reciente
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.04)', x: 4 }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${activity.color}10` }}
                  >
                    <activity.icon size={14} style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-sm truncate">{activity.action}</p>
                    <p className="text-white/25 text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
