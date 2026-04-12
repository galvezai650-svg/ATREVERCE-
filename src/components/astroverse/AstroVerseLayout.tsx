'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Orbit, Home, Compass, Box, FlaskConical, Crown, User, BookOpen, LogOut, X, Menu, Zap, Star } from 'lucide-react'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import Models3DPage from './pages/Models3DPage'
import SimulatorsPage from './pages/SimulatorsPage'
import PremiumPage from './pages/PremiumPage'
import ProfilePage from './pages/ProfilePage'
import SpaceEncyclopediaPage from './pages/SpaceEncyclopediaPage'
import { PlanBadge } from './shared/PremiumLock'

// ============================================================
// Sidebar Navigation
// ============================================================
const navItems = [
  { id: 'home', label: 'Inicio', icon: Home, premiumOnly: false },
  { id: 'explore', label: 'Explorar', icon: Compass, premiumOnly: false },
  { id: 'models3d', label: 'Modelos 3D', icon: Box, premiumOnly: true },
  { id: 'simulators', label: 'Simuladores', icon: FlaskConical, premiumOnly: false },
  { id: 'encyclopedia', label: 'Enciclopedia', icon: BookOpen, premiumOnly: false },
  { id: 'premium', label: 'Premium', icon: Crown, premiumOnly: false },
  { id: 'profile', label: 'Perfil', icon: User, premiumOnly: false },
]

function Sidebar({
  activePage, onNavigate, userName, onLogout, collapsed, onToggleCollapse, isPremium
}: {
  activePage: string
  onNavigate: (id: string) => void
  userName: string
  onLogout: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  isPremium: boolean
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onToggleCollapse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'
        } transition-all duration-300`}
        style={{
          background: isPremium
            ? 'linear-gradient(180deg, rgba(20,12,30,0.97), rgba(5,5,16,0.97))'
            : 'rgba(5,5,16,0.95)',
          borderRight: isPremium
            ? '1px solid rgba(245,158,11,0.12)'
            : '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Premium top glow line */}
        {isPremium && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed)' }}
          />
        )}

        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative"
            style={{
              background: isPremium
                ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: isPremium
                ? '0 0 20px rgba(245,158,11,0.4)'
                : '0 0 20px rgba(124,58,237,0.4)',
            }}
          >
            {isPremium ? <Crown size={20} className="text-white" /> : <Orbit size={20} className="text-white" />}
          </div>
          {!collapsed && (
            <motion.div className="flex flex-col">
              <motion.span
                className="text-lg font-bold whitespace-nowrap"
                style={{
                  background: isPremium
                    ? 'linear-gradient(to right, #f59e0b, #ec4899)'
                    : 'linear-gradient(to right, #00d4ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                AstroVerse
              </motion.span>
              <PlanBadge isPremium={isPremium} size="sm" />
            </motion.div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-5 right-4 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          <X size={18} />
        </button>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activePage === item.id
            const isLocked = item.premiumOnly && !isPremium
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); if (window.innerWidth < 1024) onToggleCollapse() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? '' : isLocked ? 'opacity-50 hover:opacity-70' : 'hover:bg-white/[0.04]'}`}
                style={{
                  background: isActive ? (isPremium ? 'rgba(245,158,11,0.08)' : 'rgba(0,212,255,0.08)') : 'transparent',
                  borderLeft: isActive ? `2px solid ${isPremium ? '#f59e0b' : '#00d4ff'}` : '2px solid transparent',
                  color: isActive ? (isPremium ? '#f59e0b' : '#00d4ff') : 'rgba(255,255,255,0.4)',
                  boxShadow: isActive ? (isPremium ? '0 0 15px rgba(245,158,11,0.08)' : '0 0 15px rgba(0,212,255,0.08)') : 'none',
                }}
              >
                <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                        PRO
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${isPremium ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.06)'}` }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 relative"
                style={{
                  background: isPremium
                    ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                    : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                }}
              >
                {userName.charAt(0).toUpperCase()}
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: isPremium ? 'rgba(20,12,30,0.97)' : '#050510' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-xs truncate" style={{ color: isPremium ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.3)' }}>
                  {isPremium ? '✦ Miembro Premium' : 'Explorador Básico'}
                </p>
              </div>
              {isPremium && !collapsed && (
                <Star size={14} className="text-amber-400 shrink-0" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              )}
            </div>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-200 active:scale-[0.98] ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ============================================================
// MAIN AstroVerseLayout
// ============================================================
export default function AstroVerseLayout({
  userName, userEmail, onLogout
}: {
  userName: string
  userEmail: string
  onLogout: () => void
}) {
  const [activePage, setActivePage] = useState('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isPremium, setIsPremium] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('astroverse_premium') === 'true'
    }
    return false
  })

  // Persist plan in localStorage
  useEffect(() => {
    localStorage.setItem('astroverse_premium', String(isPremium))
  }, [isPremium])

  const handleNavigate = useCallback((page: string) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage userName={userName} onNavigate={handleNavigate} isPremium={isPremium} onUpgrade={() => handleNavigate('premium')} />
      case 'explore': return <ExplorePage isPremium={isPremium} onUpgrade={() => handleNavigate('premium')} />
      case 'models3d': return isPremium ? <Models3DPage /> : <Models3DPageLocked onUpgrade={() => handleNavigate('premium')} />
      case 'simulators': return <SimulatorsPage isPremium={isPremium} onUpgrade={() => handleNavigate('premium')} />
      case 'premium': return <PremiumPage isPremium={isPremium} onTogglePlan={() => setIsPremium(p => !p)} />
      case 'profile': return <ProfilePage userName={userName} userEmail={userEmail} isPremium={isPremium} />
      case 'encyclopedia': return <SpaceEncyclopediaPage isPremium={isPremium} />
      default: return <HomePage userName={userName} onNavigate={handleNavigate} isPremium={isPremium} onUpgrade={() => handleNavigate('premium')} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        userName={userName}
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isPremium={isPremium}
      />

      {/* Main content */}
      <main
        className={`transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Mobile header */}
        <div
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 p-4"
          style={{
            background: isPremium
              ? 'linear-gradient(90deg, rgba(20,12,30,0.92), rgba(5,5,16,0.92))'
              : 'rgba(5,5,16,0.9)',
            borderBottom: isPremium ? '1px solid rgba(245,158,11,0.12)' : '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button onClick={() => setSidebarCollapsed(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90">
            <Menu size={20} />
          </button>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: isPremium
                ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            }}
          >
            {isPremium ? <Crown size={14} className="text-white" /> : <Orbit size={16} className="text-white" />}
          </div>
          <span
            className="text-sm font-bold flex-1"
            style={{
              background: isPremium
                ? 'linear-gradient(to right, #f59e0b, #ec4899)'
                : 'linear-gradient(to right, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AstroVerse
          </span>
          <PlanBadge isPremium={isPremium} size="sm" />
        </div>

        {/* Premium golden accent line at top of content */}
        {isPremium && (
          <div
            className="hidden lg:block h-[2px]"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #ec4899, #7c3aed, transparent)' }}
          />
        )}

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// ============================================================
// Models3DPageLocked - Shown when basic user tries to access 3D models
// ============================================================
function Models3DPageLocked({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Modelos 3D</h1>
        <p className="text-white/40">Explora el sistema solar en tres dimensiones</p>
      </motion.div>

      <motion.div
        className="rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px] relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Glow background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(60px)' }}
        />

        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 0 40px rgba(245,158,11,0.15)',
          }}
        >
          <Crown size={36} className="text-amber-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Contenido Premium</h2>
        <p className="text-white/40 text-sm max-w-md mb-8 leading-relaxed">
          Los modelos 3D interactivos, el Sistema Solar de NASA y la Tierra en 3D son exclusivos para usuarios Premium.
        </p>

        <motion.button
          onClick={onUpgrade}
          className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
          style={{
            background: 'linear-gradient(to right, #f59e0b, #ec4899)',
            boxShadow: '0 0 30px rgba(245,158,11,0.3), 0 4px 15px rgba(0,0,0,0.3)',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245,158,11,0.4), 0 4px 15px rgba(0,0,0,0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={16} />
          Desbloquear con Premium
        </motion.button>

        <p className="text-white/20 text-xs mt-4">7 días de prueba gratuita</p>
      </motion.div>
    </div>
  )
}
