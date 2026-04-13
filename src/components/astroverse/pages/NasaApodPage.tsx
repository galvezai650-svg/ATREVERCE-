'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Telescope,
  Calendar,
  Camera,
  Video,
  X,
  RefreshCw,
  AlertTriangle,
  Maximize2,
  User,
} from 'lucide-react'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// Types
// ============================================================
interface ApodData {
  date: string
  explanation: string
  hdurl?: string
  media_type: 'image' | 'video'
  service_version: string
  title: string
  url: string
  copyright?: string
}

// ============================================================
// Helpers
// ============================================================
function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateShort(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ============================================================
// Loading Skeletons
// ============================================================
function SkeletonFeatured() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ ...cardBase, background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="h-64 md:h-auto min-h-[280px] bg-white/[0.03] animate-pulse" />
        <div className="p-6 md:p-8 space-y-4">
          <div className="h-4 w-36 rounded-full bg-white/[0.04] animate-pulse" />
          <div className="h-7 w-full rounded bg-white/[0.05] animate-pulse" />
          <div className="h-7 w-5/6 rounded bg-white/[0.05] animate-pulse" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-white/[0.03] animate-pulse" />
            <div className="h-4 w-full rounded bg-white/[0.03] animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-white/[0.03] animate-pulse" />
          </div>
          <div className="pt-3 flex items-center gap-4">
            <div className="h-4 w-28 rounded bg-white/[0.04] animate-pulse" />
            <div className="h-4 w-32 rounded bg-white/[0.04] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={cardBase}
    >
      <div className="h-44 bg-white/[0.03] animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-full rounded bg-white/[0.05] animate-pulse" />
        <div className="h-3 w-24 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-32 rounded bg-white/[0.04] animate-pulse" />
      </div>
    </div>
  )
}

// ============================================================
// Error State
// ============================================================
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.15)',
        }}
      >
        <AlertTriangle size={28} className="text-red-400/60" />
      </div>
      <p className="text-white/50 text-sm font-medium mb-1">No se pudieron cargar las imágenes</p>
      <p className="text-white/30 text-xs mb-5">Hubo un error al conectar con la API de NASA</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
        style={{
          background: 'rgba(0,212,255,0.1)',
          border: '1px solid rgba(0,212,255,0.25)',
          color: '#00d4ff',
        }}
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </motion.div>
  )
}

// ============================================================
// Featured APOD Card
// ============================================================
function FeaturedApod({ apod, onSelect }: { apod: ApodData; onSelect: (a: ApodData) => void }) {
  const isVideo = apod.media_type === 'video'

  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative group cursor-pointer"
      style={cardBase}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.005 }}
      onHoverStart={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
          e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.08), 0 12px 40px rgba(0,0,0,0.4)'
        }
      }}
      onHoverEnd={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
      onClick={() => onSelect(apod)}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, transparent)" />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
          style={{
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.25)',
            color: '#00d4ff',
          }}
        >
          {isVideo ? <Video size={12} /> : <Camera size={12} />}
          Foto del día
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image / Video placeholder */}
        <div className="relative h-64 md:h-auto min-h-[280px] bg-gradient-to-br from-cyan-900/20 via-violet-900/10 to-black overflow-hidden">
          {isVideo ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(124,58,237,0.2)',
                  border: '1px solid rgba(124,58,237,0.3)',
                }}
              >
                <Video size={28} className="text-violet-400" />
              </div>
              <span className="text-white/30 text-xs">Contenido de video</span>
            </div>
          ) : (
            <img
              src={apod.url}
              alt={apod.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent 60%, rgba(5,5,16,0.8))',
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-cyan-400/80">
            <Calendar size={12} />
            {formatDate(apod.date)}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors duration-300">
            {apod.title}
          </h2>

          <p className="text-white/50 text-sm leading-relaxed line-clamp-4">
            {apod.explanation}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            {apod.copyright && (
              <span className="flex items-center gap-1.5">
                <User size={12} />
                {apod.copyright}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              {isVideo ? <Video size={12} /> : <Camera size={12} />}
              {isVideo ? 'Video' : 'Imagen'}
            </span>
          </div>

          {/* Expand button */}
          <div className="pt-2">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] w-fit"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.08))',
                border: '1px solid rgba(0,212,255,0.25)',
                color: '#00d4ff',
              }}
            >
              <Maximize2 size={14} />
              Ver en grande
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Gallery Card
// ============================================================
function ApodCard({ apod, index, onSelect }: { apod: ApodData; index: number; onSelect: (a: ApodData) => void }) {
  const isVideo = apod.media_type === 'video'

  return (
    <motion.div
      className="rounded-xl overflow-hidden relative group cursor-pointer"
      style={cardBase}
      variants={staggerItem}
      whileHover={{ scale: 1.02 }}
      onHoverStart={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.3)'
        }
      }}
      onHoverEnd={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
      onClick={() => onSelect(apod)}
    >
      <CardGradientTop color="linear-gradient(90deg, #00d4ff, transparent)" />

      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-cyan-900/15 via-violet-900/10 to-black overflow-hidden">
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.25)',
              }}
            >
              <Video size={22} className="text-violet-400" />
            </div>
          </div>
        ) : (
          <img
            src={apod.url}
            alt={apod.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        )}

        {/* Media type badge */}
        <span
          className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-medium backdrop-blur-md"
          style={{
            background: isVideo ? 'rgba(124,58,237,0.2)' : 'rgba(0,212,255,0.15)',
            border: isVideo ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(0,212,255,0.25)',
            color: isVideo ? '#a78bfa' : '#00d4ff',
          }}
        >
          {isVideo ? 'Video' : 'Imagen'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-cyan-300 transition-colors duration-200 line-clamp-2">
          {apod.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-white/35">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDateShort(apod.date)}
          </span>
          {apod.copyright && (
            <span className="flex items-center gap-1 truncate">
              <User size={11} />
              <span className="truncate max-w-[80px]">{apod.copyright}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Image Modal
// ============================================================
function ApodModal({ apod, onClose }: { apod: ApodData | null; onClose: () => void }) {
  const isVideo = apod?.media_type === 'video'

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (apod) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [apod, onClose])

  return (
    <AnimatePresence>
      {apod && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              ...cardBase,
              background: 'rgba(10,10,30,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899, transparent)" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <X size={16} className="text-white/60" />
            </button>

            {/* Image / Video */}
            {isVideo ? (
              <div className="relative w-full aspect-video bg-gradient-to-br from-violet-900/20 to-black flex items-center justify-center">
                <div
                  className="flex flex-col items-center gap-3"
                  style={{
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                    <Video size={36} className="text-violet-400" />
                  </div>
                  <span className="text-white/40 text-sm">Video de NASA APOD</span>
                  <a
                    href={apod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
                  >
                    Abrir video en NASA
                  </a>
                </div>
              </div>
            ) : (
              <div className="relative w-full">
                <img
                  src={apod.hdurl || apod.url}
                  alt={apod.title}
                  className="w-full object-contain max-h-[50vh]"
                />
              </div>
            )}

            {/* Info */}
            <div className="p-6 md:p-8 space-y-4">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-cyan-400/80">
                <Calendar size={12} />
                {formatDate(apod.date)}
                {apod.copyright && (
                  <>
                    <span className="mx-2 text-white/15">·</span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {apod.copyright}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {apod.title}
              </h2>

              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                {apod.explanation}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================
// NasaApodPage
// ============================================================
export default function NasaApodPage() {
  const [featured, setFeatured] = useState<ApodData | null>(null)
  const [gallery, setGallery] = useState<ApodData[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [error, setError] = useState(false)
  const [selectedApod, setSelectedApod] = useState<ApodData | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const doFetch = useCallback((onError: () => void, onLoadFeatured: () => void, onLoadGallery: () => void) => {
    // Fetch today's APOD (featured)
    fetch('/api/apod')
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => {
        setFeatured(data)
        onLoadFeatured()
      })
      .catch(() => {
        onError()
        onLoadFeatured()
      })

    // Fetch 7 days of APOD
    fetch('/api/apod?count=7')
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then(data => {
        const items = Array.isArray(data) ? data : [data]
        setGallery(items)
        onLoadGallery()
      })
      .catch(() => {
        onError()
        onLoadGallery()
      })
  }, [])

  useEffect(() => {
    // Reset loading states via transition to satisfy react-hooks/set-state-in-effect
    doFetch(() => setError(true), () => setLoadingFeatured(false), () => setLoadingGallery(false))
  }, [retryKey, doFetch])

  const handleRetry = () => {
    setRetryKey(k => k + 1)
    setError(false)
    setLoadingFeatured(true)
    setLoadingGallery(true)
    setFeatured(null)
    setGallery([])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            <Telescope size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Galería NASA APOD</h1>
          </div>
        </div>
        <p className="text-white/40 ml-[52px]">
          Foto astronómica del día y archivo de imágenes
        </p>
      </motion.div>

      {/* Error state */}
      {error && !loadingFeatured && !featured && (
        <ErrorState onRetry={handleRetry} />
      )}

      {/* Loading state */}
      {(loadingFeatured || loadingGallery) && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {loadingFeatured && <SkeletonFeatured />}
          {loadingGallery && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Featured APOD */}
      {!loadingFeatured && featured && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
            <span className="text-xs font-medium text-cyan-400/60 uppercase tracking-wider">Hoy</span>
            <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/30 to-transparent" />
          </div>
          <FeaturedApod apod={featured} onSelect={setSelectedApod} />
        </motion.div>
      )}

      {/* Gallery Grid */}
      {!loadingGallery && gallery.length > 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
            <span className="text-xs font-medium text-violet-400/60 uppercase tracking-wider">Últimos 7 días</span>
            <div className="h-px flex-1 bg-gradient-to-l from-violet-500/30 to-transparent" />
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {gallery.map((apod, i) => (
              <ApodCard
                key={`${apod.date}-${i}`}
                apod={apod}
                index={i}
                onSelect={setSelectedApod}
              />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Modal */}
      <ApodModal apod={selectedApod} onClose={() => setSelectedApod(null)} />
    </div>
  )
}
