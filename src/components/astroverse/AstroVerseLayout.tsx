'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Orbit, Home, Compass, Box, FlaskConical, GraduationCap, User, BookOpen, LogOut, X, Menu, School, Heart, Sparkles } from 'lucide-react'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import Models3DPage from './pages/Models3DPage'
import SimulatorsPage from './pages/SimulatorsPage'
import PremiumPage from './pages/PremiumPage'
import ProfilePage from './pages/ProfilePage'
import SpaceEncyclopediaPage from './pages/SpaceEncyclopediaPage'
import AulaPage from './pages/AulaPage'
import DonacionesPage from './pages/DonacionesPage'

// ============================================================
// Sidebar Navigation
// ============================================================
const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'models3d', label: 'Modelos 3D', icon: Box },
  { id: 'simulators', label: 'Simuladores', icon: FlaskConical },
  { id: 'encyclopedia', label: 'Enciclopedia', icon: BookOpen },
  { id: 'aula', label: 'Aula Virtual', icon: School, badge: 'FREE' },
  { id: 'pro', label: 'AstroVerse PRO', icon: GraduationCap, badge: '$4.99' },
  { id: 'donaciones', label: 'Donaciones', icon: Heart, badge: 'USD' },
  { id: 'profile', label: 'Perfil', icon: User },
]

function Sidebar({
  activePage, onNavigate, userName, onLogout, collapsed, onToggleCollapse
}: {
  activePage: string
  onNavigate: (id: string) => void
  userName: string
  onLogout: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  return (
    <>
      <AnimatePresence>
        {!collapsed && (
          <motion.div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onToggleCollapse} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'
        } transition-all duration-300`}
        style={{
          background: 'rgba(5,5,16,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)' }} />

        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <Orbit size={20} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div className="flex flex-col">
              <motion.span
                className="text-lg font-bold whitespace-nowrap"
                style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                AstroVerse
              </motion.span>
              <span className="text-[9px] font-medium text-white/25 tracking-wider">EXPLORADOR ESPACIAL</span>
            </motion.div>
          )}
        </div>

        <button onClick={onToggleCollapse} className="absolute top-5 right-4 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95">
          <X size={18} />
        </button>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activePage === item.id
            const isAula = item.id === 'aula'
            const isPro = item.id === 'pro'
            const isDonacion = item.id === 'donaciones'
            const isSpecial = isAula || isPro || isDonacion
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); if (window.innerWidth < 1024) onToggleCollapse() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? '' : 'hover:bg-white/[0.04]'}`}
                style={{
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                  color: isActive ? '#00d4ff' : isAula ? 'rgba(16,185,129,0.7)' : isPro ? 'rgba(0,212,255,0.7)' : isDonacion ? 'rgba(245,158,11,0.7)' : 'rgba(255,255,255,0.4)',
                  boxShadow: isActive ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
                }}
              >
                <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{
                        background: item.id === 'aula' ? 'rgba(16,185,129,0.1)' : item.id === 'donaciones' ? 'rgba(245,158,11,0.1)' : 'rgba(0,212,255,0.1)',
                        color: item.id === 'aula' ? '#10b981' : item.id === 'donaciones' ? '#f59e0b' : '#00d4ff',
                        border: item.id === 'aula' ? '1px solid rgba(16,185,129,0.2)' : item.id === 'donaciones' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(0,212,255,0.2)',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Luminous Donate USD Button */}
        <div className="px-3 py-2">
          <motion.button
            onClick={() => { onNavigate('donaciones'); if (window.innerWidth < 1024) onToggleCollapse() }}
            className={`w-full relative overflow-hidden rounded-xl transition-all duration-200 active:scale-[0.97] ${
              collapsed ? 'h-11 flex items-center justify-center' : 'py-3'
            }`}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ec4899, #f59e0b)',
              backgroundSize: '200% 200%',
              boxShadow: '0 0 25px rgba(245,158,11,0.4), 0 0 50px rgba(236,72,153,0.2), 0 0 80px rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.4)',
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(236,72,153,0.3), 0 0 120px rgba(245,158,11,0.15)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.25) 55%, transparent 70%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            {/* Pulsing glow overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 70%)',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <div className={`relative z-10 flex items-center ${collapsed ? '' : 'gap-2.5 px-3'}`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <Heart size={18} className="text-white" fill="white" />
              </motion.div>
              {!collapsed && (
                <>
                  <span className="text-xs font-bold text-white tracking-wide">Donar</span>
                  <span className="ml-auto text-[10px] font-black text-white/90 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">USD</span>
                </>
              )}
            </div>
          </motion.button>

          {!collapsed && (
            <motion.div
              className="flex items-center justify-center gap-1 mt-1.5"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles size={8} className="text-amber-400/40" />
              <span className="text-[9px] text-amber-400/40 font-medium">Apoya nuestro proyecto</span>
              <Sparkles size={8} className="text-amber-400/40" />
            </motion.div>
          )}
        </div>

        {/* User section */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 relative" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                {userName.charAt(0).toUpperCase()}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#050510' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-xs truncate text-white/30">Explorador Espacial</p>
              </div>
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

  const handleNavigate = useCallback((page: string) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage userName={userName} onNavigate={handleNavigate} />
      case 'explore': return <ExplorePage />
      case 'models3d': return <Models3DPage />
      case 'simulators': return <SimulatorsPage />
      case 'pro': return <PremiumPage />
      case 'aula': return <AulaPage />
      case 'donaciones': return <DonacionesPage />
      case 'profile': return <ProfilePage userName={userName} userEmail={userEmail} />
      case 'encyclopedia': return <SpaceEncyclopediaPage />
      default: return <HomePage userName={userName} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050510' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} userName={userName} onLogout={onLogout} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 min-h-screen ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 p-4" style={{ background: 'rgba(5,5,16,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarCollapsed(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90">
            <Menu size={20} />
          </button>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
            <Orbit size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold flex-1" style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AstroVerse</span>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activePage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
