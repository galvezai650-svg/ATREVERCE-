'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2, Zap, Clock, Cpu, BarChart3, RotateCcw, Rocket, Activity,
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// SimulatorsPage
// ============================================================
export default function SimulatorsPage({ isPremium, onUpgrade }: { isPremium?: boolean; onUpgrade?: () => void }) {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: 'Peso Planetario', icon: Globe2 },
    { label: 'Gravedad', icon: Zap },
    { label: 'Edad Espacial', icon: Clock },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Simuladores</h1>
        <p className="text-white/40">Experimenta la física espacial de forma interactiva</p>
      </motion.div>

      {/* Tabs */}
      <motion.div className="flex gap-2 overflow-x-auto pb-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: activeTab === i ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: activeTab === i ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: activeTab === i ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === i ? '0 0 15px rgba(0,212,255,0.08)' : 'none',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 0 && <WeightCalculatorEnhanced key="weight" />}
        {activeTab === 1 && <GravitySimulator key="gravity" />}
        {activeTab === 2 && <AgeInSpaceCalculator key="age" />}
      </AnimatePresence>
    </div>
  )
}

// Weight Calculator (enhanced version)
function WeightCalculatorEnhanced() {
  const planets = [
    { name: 'Mercurio', emoji: '☿', factor: 0.38, gravity: '3.7 m/s²', distance: '57.9M km' },
    { name: 'Venus', emoji: '♀', factor: 0.91, gravity: '8.87 m/s²', distance: '108.2M km' },
    { name: 'Marte', emoji: '♂', factor: 0.38, gravity: '3.72 m/s²', distance: '227.9M km' },
    { name: 'Júpiter', emoji: '♃', factor: 2.34, gravity: '24.79 m/s²', distance: '778.6M km' },
    { name: 'Saturno', emoji: '♄', factor: 1.06, gravity: '10.44 m/s²', distance: '1.43B km' },
    { name: 'Luna', emoji: '🌙', factor: 0.16, gravity: '1.62 m/s²', distance: '384K km' },
    { name: 'Neptuno', emoji: '♆', factor: 1.19, gravity: '11.15 m/s²', distance: '4.5B km' },
    { name: 'Urano', emoji: ' us', factor: 0.92, gravity: '8.69 m/s²', distance: '2.87B km' },
  ]

  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [weight, setWeight] = useState(70)
  const [showComparison, setShowComparison] = useState(false)
  const result = (weight * selectedPlanet.factor).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-6 relative backdrop-blur-xl"
      style={cardBase}
    >
      <CardGradientTop color="linear-gradient(90deg, #f59e0b, transparent)" />
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Cpu size={20} className="text-amber-400" />
          Calculadora de Peso Planetario
        </h3>
        <button
          onClick={() => {
            setShowComparison(!showComparison)
            if (!showComparison) toast.info('Tabla de comparación activada')
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]"
          style={{
            background: showComparison ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
            border: showComparison ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
            color: showComparison ? '#f59e0b' : 'rgba(255,255,255,0.6)',
          }}
        >
          <BarChart3 size={16} />
          Comparar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-white/40 text-xs mb-2 block">Tu peso en la Tierra (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(Number(e.target.value) || 0)}
              className="w-full rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div>
            <label className="text-white/40 text-xs mb-2 block">Selecciona un planeta</label>
            <div className="grid grid-cols-4 gap-2">
              {planets.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanet(p)}
                  className="rounded-lg px-2 py-2 text-xs transition-all duration-200 text-center hover:scale-[1.05] active:scale-[0.95]"
                  style={{
                    background: selectedPlanet.name === p.name ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                    border: selectedPlanet.name === p.name ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: selectedPlanet.name === p.name ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                    boxShadow: selectedPlanet.name === p.name ? '0 0 12px rgba(245,158,11,0.1)' : 'none',
                  }}
                >
                  <div className="text-lg mb-0.5">{p.emoji}</div>
                  <div className="truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            className="rounded-xl p-6 text-center"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
            key={selectedPlanet.name + result}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
          >
            <p className="text-white/40 text-xs mb-1">Tu peso en {selectedPlanet.name}</p>
            <p className="text-4xl font-bold text-amber-400">{selectedPlanet.emoji} {result} kg</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-[10px] mb-0.5">Gravedad</p>
              <p className="text-white/70 text-sm font-mono">{selectedPlanet.gravity}</p>
            </div>
            <div className="rounded-lg p-3 text-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-[10px] mb-0.5">Distancia al Sol</p>
              <p className="text-white/70 text-sm font-mono">{selectedPlanet.distance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <h4 className="text-white/60 text-sm font-medium mb-3">Tu peso en todos los planetas:</h4>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Planeta</div>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Gravedad</div>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Tu Peso</div>
                <div className="p-3 text-center font-medium" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Distancia</div>
                {planets.map(p => (
                  <React.Fragment key={p.name}>
                    <div className="p-2.5 text-center text-sm flex items-center justify-center gap-1" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.7)' }}>
                      <span>{p.emoji}</span>
                      <span className="text-xs">{p.name}</span>
                    </div>
                    <div className="p-2.5 text-center text-xs font-mono" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.5)' }}>
                      {p.gravity}
                    </div>
                    <div className="p-2.5 text-center text-sm font-bold" style={{ background: 'rgba(10,10,25,0.9)', color: '#f59e0b' }}>
                      {(weight * p.factor).toFixed(1)} kg
                    </div>
                    <div className="p-2.5 text-center text-xs font-mono" style={{ background: 'rgba(10,10,25,0.9)', color: 'rgba(255,255,255,0.4)' }}>
                      {p.distance}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Gravity Simulator - Ball bouncing animation
function GravitySimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gravity, setGravity] = useState(9.8)
  const ballRef = useRef({ x: 200, y: 50, vy: 0, vx: 2 })
  const gravityRef = useRef(gravity)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    gravityRef.current = gravity
  }, [gravity])

  const resetBall = useCallback(() => {
    ballRef.current = { x: 200, y: 50, vy: 0, vx: 2 }
    toast.info('Pelota reiniciada')
  }, [])

  const launchBall = useCallback(() => {
    ballRef.current.vy = -(Math.random() * 8 + 5)
    ballRef.current.vx = (Math.random() - 0.5) * 6
    toast.success('¡Pelota lanzada!')
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setupCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    setupCanvas()
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    const ball = ballRef.current
    const radius = 12
    let animId: number

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Ground line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, h - 20)
      ctx.lineTo(w, h - 20)
      ctx.stroke()

      // Physics
      ball.vy += gravityRef.current * 0.05
      ball.y += ball.vy
      ball.x += ball.vx

      // Bounce
      if (ball.y + radius > h - 20) {
        ball.y = h - 20 - radius
        ball.vy *= -0.75
      }
      if (ball.x + radius > w || ball.x - radius < 0) {
        ball.vx *= -1
        ball.x = Math.max(radius, Math.min(w - radius, ball.x))
      }

      // Ball glow
      const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, radius * 3)
      gradient.addColorStop(0, 'rgba(0,212,255,0.3)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Ball
      const ballGradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, radius)
      ballGradient.addColorStop(0, '#00d4ff')
      ballGradient.addColorStop(1, '#7c3aed')
      ctx.fillStyle = ballGradient
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        setupCanvas()
      }, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
    }
  }, [])

  const planetGravities = [
    { name: 'Luna', g: 1.62 },
    { name: 'Marte', g: 3.72 },
    { name: 'Tierra', g: 9.8 },
    { name: 'Júpiter', g: 24.79 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-4 relative backdrop-blur-xl"
      style={cardBase}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, transparent)" />
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Zap size={20} className="text-cyan-400" />
          Simulador de Gravedad
        </h3>
        <div className="flex gap-2">
          <button
            onClick={resetBall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={launchBall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium shimmer transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              color: 'white',
              boxShadow: '0 0 25px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <Rocket size={14} />
            Lanzar
          </button>
        </div>
      </div>
      <p className="text-white/40 text-sm">Ajusta la gravedad y observa cómo cambia la caída de la pelota.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {planetGravities.map(pg => (
          <button
            key={pg.name}
            onClick={() => setGravity(pg.g)}
            className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.95]"
            style={{
              background: Math.abs(gravity - pg.g) < 0.1 ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: Math.abs(gravity - pg.g) < 0.1 ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: Math.abs(gravity - pg.g) < 0.1 ? '#00d4ff' : 'rgba(255,255,255,0.4)',
              boxShadow: Math.abs(gravity - pg.g) < 0.1 ? '0 0 12px rgba(0,212,255,0.08)' : 'none',
            }}
          >
            {pg.name} ({pg.g} m/s²)
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
      />

      <div className="flex items-center gap-4">
        <label className="text-white/40 text-xs shrink-0">Gravedad: {gravity.toFixed(2)} m/s²</label>
        <input
          type="range"
          min={0.5}
          max={30}
          step={0.1}
          value={gravity}
          onChange={e => setGravity(Number(e.target.value))}
          className="flex-1 accent-cyan-500"
        />
      </div>
    </motion.div>
  )
}

// Age in Space Calculator
function AgeInSpaceCalculator() {
  const planets = [
    { name: 'Mercurio', emoji: '☿', days: 88, years: 0.24, color: '#9ca3af' },
    { name: 'Venus', emoji: '♀', days: 225, years: 0.62, color: '#f97316' },
    { name: 'Marte', emoji: '♂', days: 687, years: 1.88, color: '#ef4444' },
    { name: 'Júpiter', emoji: '♃', days: 4333, years: 11.86, color: '#f59e0b' },
    { name: 'Saturno', emoji: '♄', days: 10759, years: 29.46, color: '#eab308' },
    { name: 'Urano', emoji: ' us', days: 30687, years: 84.01, color: '#14b8a6' },
    { name: 'Neptuno', emoji: '♆', days: 60190, years: 164.8, color: '#6366f1' },
  ]

  const [earthAge, setEarthAge] = useState(25)
  const maxAge = Math.max(...planets.map(p => earthAge / p.years))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl p-6 md:p-8 space-y-6 relative backdrop-blur-xl"
      style={cardBase}
    >
      <CardGradientTop color="linear-gradient(90deg, #ec4899, transparent)" />
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Clock size={20} className="text-pink-400" />
        Calculadora de Edad Espacial
      </h3>
      <p className="text-white/40 text-sm">Descubre tu edad en cada planeta del sistema solar.</p>

      <div className="max-w-xs">
        <label className="text-white/40 text-xs mb-2 block">Tu edad en la Tierra</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={earthAge}
            onChange={e => setEarthAge(Number(e.target.value) || 0)}
            className="flex-1 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <span className="text-white/40 text-sm">años</span>
        </div>
      </div>

      {/* Visual bar chart */}
      <div>
        <h4 className="text-white/50 text-xs font-medium mb-3 flex items-center gap-1.5">
          <Activity size={14} className="text-pink-400" />
          Comparativa visual de edades
        </h4>
        <div className="space-y-2.5">
          {planets.map(p => {
            const ageOnPlanet = earthAge / p.years
            const barWidth = maxAge > 0 ? Math.min((ageOnPlanet / maxAge) * 100, 100) : 0
            return (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-lg w-6 text-center shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white/50 text-xs">{p.name}</span>
                    <span className="text-white/70 text-xs font-mono">{ageOnPlanet.toFixed(1)} años</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Planet cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {planets.map(p => {
          const ageOnPlanet = (earthAge / p.years).toFixed(2)
          return (
            <motion.div
              key={p.name}
              className="rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={e => {
                if (e.currentTarget) {
                  e.currentTarget.style.borderColor = `${p.color}30`
                  e.currentTarget.style.boxShadow = `0 0 15px ${p.color}10`
                }
              }}
              onHoverEnd={e => {
                if (e.currentTarget) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
              onClick={() => toast.info(`En ${p.name} tendrías ${ageOnPlanet} años`)}
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1">
                <p className="text-white/60 text-xs">{p.name}</p>
                <p className="text-white font-semibold">
                  {ageOnPlanet} <span className="text-white/40 text-xs">años</span>
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
