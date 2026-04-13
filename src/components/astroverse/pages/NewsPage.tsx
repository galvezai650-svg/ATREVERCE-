'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Newspaper,
  ExternalLink,
  Calendar,
  Tag,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// Types
// ============================================================
interface Article {
  id: string
  title: string
  summary: string
  source: string
  date: string
  category: string
  imageUrl: string
}

// ============================================================
// Category config
// ============================================================
const categoryConfig: Record<string, { color: string; gradient: string; icon: string }> = {
  NASA: { color: '#00d4ff', gradient: 'from-cyan-600/30 to-cyan-900/10', icon: '🚀' },
  SpaceX: { color: '#7c3aed', gradient: 'from-violet-600/30 to-violet-900/10', icon: '🛸' },
  Descubrimientos: { color: '#f59e0b', gradient: 'from-amber-600/30 to-amber-900/10', icon: '🔬' },
  Telescopios: { color: '#ec4899', gradient: 'from-pink-600/30 to-pink-900/10', icon: '🔭' },
  Exploración: { color: '#10b981', gradient: 'from-emerald-600/30 to-emerald-900/10', icon: '🌍' },
}

const categories = ['Todas', 'NASA', 'SpaceX', 'Descubrimientos', 'Telescopios', 'Exploración']

// ============================================================
// Helpers
// ============================================================
function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ============================================================
// Loading Skeleton
// ============================================================
function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={cardBase}
    >
      <div className="h-44 bg-white/[0.03] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="h-5 w-full rounded bg-white/[0.05] animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-white/[0.05] animate-pulse" />
        <div className="h-3 w-full rounded bg-white/[0.03] animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-white/[0.03] animate-pulse" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-white/[0.04] animate-pulse" />
          <div className="h-3 w-16 rounded bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function SkeletonFeatured() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ ...cardBase, background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="h-56 md:h-auto bg-white/[0.03] animate-pulse" />
        <div className="p-6 md:p-8 space-y-4">
          <div className="h-5 w-32 rounded-full bg-white/[0.04] animate-pulse" />
          <div className="h-7 w-full rounded bg-white/[0.05] animate-pulse" />
          <div className="h-7 w-5/6 rounded bg-white/[0.05] animate-pulse" />
          <div className="h-4 w-full rounded bg-white/[0.03] animate-pulse" />
          <div className="h-4 w-full rounded bg-white/[0.03] animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-white/[0.03] animate-pulse" />
          <div className="pt-3 flex items-center gap-4">
            <div className="h-4 w-24 rounded bg-white/[0.04] animate-pulse" />
            <div className="h-4 w-28 rounded bg-white/[0.04] animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Featured Article Card
// ============================================================
function FeaturedArticle({ article }: { article: Article }) {
  const cfg = categoryConfig[article.category] || categoryConfig.NASA

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
          e.currentTarget.style.borderColor = `${cfg.color}25`
          e.currentTarget.style.boxShadow = `0 0 40px ${cfg.color}10, 0 12px 40px rgba(0,0,0,0.4)`
        }
      }}
      onHoverEnd={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <CardGradientTop color={`linear-gradient(90deg, ${cfg.color}, ${cfg.color}00)`} />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
          style={{
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}30`,
            color: cfg.color,
          }}
        >
          <TrendingUp size={12} />
          Destacado
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image placeholder */}
        <div className={`relative h-56 md:h-auto min-h-[240px] bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}>
          <span className="text-7xl opacity-60 group-hover:scale-110 transition-transform duration-500">
            {cfg.icon}
          </span>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${cfg.color}, transparent 70%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
          {/* Category badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit"
            style={{
              background: `${cfg.color}12`,
              border: `1px solid ${cfg.color}25`,
              color: cfg.color,
            }}
          >
            <Tag size={12} />
            {article.category}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors duration-300">
            {article.title}
          </h2>

          <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
            {article.summary}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Newspaper size={12} />
              {article.source}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(article.date)}
            </span>
          </div>

          {/* CTA */}
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] w-fit group/btn"
            style={{
              background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`,
              border: `1px solid ${cfg.color}30`,
              color: cfg.color,
            }}
          >
            Leer más
            <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// Article Card
// ============================================================
function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cfg = categoryConfig[article.category] || categoryConfig.NASA

  return (
    <motion.div
      className="rounded-xl overflow-hidden relative group cursor-pointer"
      style={cardBase}
      variants={staggerItem}
      whileHover={{ scale: 1.02 }}
      onHoverStart={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = `${cfg.color}25`
          e.currentTarget.style.boxShadow = `0 0 30px ${cfg.color}10, 0 8px 32px rgba(0,0,0,0.3)`
        }
      }}
      onHoverEnd={e => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <CardGradientTop color={`linear-gradient(90deg, ${cfg.color}, transparent)`} />

      {/* Image placeholder */}
      <div className={`relative h-40 bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}>
        <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform duration-500">
          {cfg.icon}
        </span>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${cfg.color}, transparent 70%)`,
          }}
        />
        {/* Category badge on image */}
        <span
          className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-md"
          style={{
            background: `${cfg.color}20`,
            border: `1px solid ${cfg.color}30`,
            color: cfg.color,
          }}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-cyan-300 transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-white/35">
            <span className="flex items-center gap-1">
              <Newspaper size={11} />
              {article.source}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(article.date)}
            </span>
          </div>
          <button
            className="flex items-center gap-1 text-xs font-medium transition-colors duration-200"
            style={{ color: `${cfg.color}cc` }}
          >
            Leer más
            <ExternalLink size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// NewsPage
// ============================================================
export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Todas')

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'Todas'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const featured = filtered[0]
  const rest = filtered.slice(1)

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
            <Newspaper size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Noticias Espaciales</h1>
          </div>
        </div>
        <p className="text-white/40 ml-[52px]">
          Las últimas novedades del universo, actualizadas constantemente
        </p>
      </motion.div>

      {/* Category filter tabs */}
      <motion.div
        className="flex flex-wrap items-center gap-2"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map(cat => {
          const cfg = cat !== 'Todas' ? categoryConfig[cat] : null
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5"
              style={{
                background: isActive
                  ? cfg
                    ? `${cfg.color}12`
                    : 'rgba(0,212,255,0.1)'
                  : 'rgba(255,255,255,0.03)',
                border: isActive
                  ? cfg
                    ? `1px solid ${cfg.color}35`
                    : '1px solid rgba(0,212,255,0.3)'
                  : '1px solid rgba(255,255,255,0.06)',
                color: isActive
                  ? cfg
                    ? cfg.color
                    : '#00d4ff'
                  : 'rgba(255,255,255,0.4)',
                boxShadow: isActive
                  ? cfg
                    ? `0 0 15px ${cfg.color}12`
                    : '0 0 15px rgba(0,212,255,0.08)'
                  : 'none',
              }}
              onMouseEnter={e => {
                if (e.currentTarget && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                if (e.currentTarget && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              {cat === 'Todas' && <Sparkles size={13} />}
              {cat !== 'Todas' && cfg && <Tag size={13} />}
              {cat}
            </button>
          )
        })}
      </motion.div>

      {/* Loading state */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <SkeletonFeatured />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Newspaper size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No hay noticias en esta categoría</p>
          <button
            onClick={() => setActiveCategory('Todas')}
            className="mt-4 text-cyan-400 text-sm hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            Ver todas las noticias
            <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Content */}
      {!loading && filtered.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Featured article */}
            {featured && <FeaturedArticle article={featured} />}

            {/* Article grid */}
            {rest.length > 0 && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {rest.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
