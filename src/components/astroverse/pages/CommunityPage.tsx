'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  MessageCircle,
  Send,
  Heart,
  Sparkles,
  Loader2,
  PenLine,
} from 'lucide-react'
import { toast } from 'sonner'
import { cardBase, staggerContainer, staggerItem } from '../shared/styles'
import CardGradientTop from '../shared/CardGradientTop'

// ============================================================
// Types
// ============================================================
interface CommunityPost {
  id: string
  userId: string
  title: string
  content: string
  category: 'general' | 'fotos' | 'preguntas' | 'descubrimientos'
  likes: number
  createdAt: string
  user: { name: string }
}

// ============================================================
// Category config
// ============================================================
const categoryConfig: Record<
  string,
  { color: string; label: string; gradient: string }
> = {
  general: {
    color: '#00d4ff',
    label: 'General',
    gradient: 'from-cyan-600/20 to-cyan-900/5',
  },
  fotos: {
    color: '#ec4899',
    label: 'Fotos',
    gradient: 'from-pink-600/20 to-pink-900/5',
  },
  preguntas: {
    color: '#f59e0b',
    label: 'Preguntas',
    gradient: 'from-amber-600/20 to-amber-900/5',
  },
  descubrimientos: {
    color: '#10b981',
    label: 'Descubrimientos',
    gradient: 'from-emerald-600/20 to-emerald-900/5',
  },
}

const categoryKeys = ['general', 'fotos', 'preguntas', 'descubrimientos'] as const
type CategoryKey = (typeof categoryKeys)[number]

const filterOptions = ['Todas', ...categoryKeys] as const
type FilterOption = (typeof filterOptions)[number]

// ============================================================
// Helpers
// ============================================================
function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (seconds < 60) return 'ahora mismo'
  if (minutes === 1) return 'hace 1 minuto'
  if (minutes < 60) return `hace ${minutes} minutos`
  if (hours === 1) return 'hace 1 hora'
  if (hours < 24) return `hace ${hours} horas`
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  if (weeks === 1) return 'hace 1 semana'
  if (weeks < 4) return `hace ${weeks} semanas`
  if (months === 1) return 'hace 1 mes'
  return `hace ${months} meses`
}

// ============================================================
// Loading Skeleton
// ============================================================
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden relative" style={cardBase}>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/[0.04] animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-3.5 w-28 rounded bg-white/[0.05] animate-pulse" />
            <div className="h-2.5 w-16 rounded bg-white/[0.03] animate-pulse" />
          </div>
        </div>
        <div className="h-4 w-20 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-white/[0.05] animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-white/[0.05] animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-white/[0.03] animate-pulse" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-8 w-16 rounded-lg bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Post Card
// ============================================================
function PostCard({
  post,
  userId,
  onLike,
}: {
  post: CommunityPost
  userId: string
  onLike: (id: string) => void
}) {
  const cfg = categoryConfig[post.category] || categoryConfig.general
  const isOwn = post.userId === userId
  const [heartBounce, setHeartBounce] = useState(false)

  const handleLike = () => {
    setHeartBounce(true)
    onLike(post.id)
    setTimeout(() => setHeartBounce(false), 400)
  }

  return (
    <motion.div
      className="rounded-xl overflow-hidden relative group"
      style={cardBase}
      variants={staggerItem}
      onHoverStart={(e) => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = `${cfg.color}20`
          e.currentTarget.style.boxShadow = `0 0 25px ${cfg.color}08, 0 8px 32px rgba(0,0,0,0.25)`
        }
      }}
      onHoverEnd={(e) => {
        if (e.currentTarget) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <CardGradientTop
        color={`linear-gradient(90deg, ${cfg.color}80, transparent)`}
      />

      <div className="p-5 space-y-4">
        {/* User row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar with first letter */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{
                background: `linear-gradient(135deg, ${cfg.color}30, ${cfg.color}10)`,
                border: `1px solid ${cfg.color}30`,
              }}
            >
              {post.user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">
                {post.user?.name || 'Anónimo'}
              </span>
              {isOwn && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${cfg.color}12`,
                    border: `1px solid ${cfg.color}20`,
                    color: `${cfg.color}aa`,
                  }}
                >
                  Tu publicación
                </span>
              )}
            </div>
          </div>
          <span className="text-white/30 text-xs shrink-0">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        {/* Category badge */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: `${cfg.color}10`,
            border: `1px solid ${cfg.color}20`,
            color: cfg.color,
          }}
        >
          <Sparkles size={11} />
          {cfg.label}
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-[15px] leading-snug">
          {post.title}
        </h3>

        {/* Content */}
        <p className="text-white/45 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Like button */}
        <div className="flex items-center gap-2 pt-1">
          <motion.button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 hover:bg-white/[0.04]"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              color: heartBounce ? '#ec4899' : 'rgba(255,255,255,0.5)',
            }}
            whileTap={{ scale: 0.92 }}
          >
            <motion.span
              animate={
                heartBounce
                  ? { scale: [1, 1.4, 0.9, 1.15, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.4 }}
            >
              <Heart
                size={15}
                fill={heartBounce ? '#ec4899' : 'none'}
              />
            </motion.span>
            <span className="text-xs">{post.likes}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// CommunityPage
// ============================================================
export default function CommunityPage({
  userId,
  userName,
}: {
  userId: string
  userName: string
}) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterOption>('Todas')

  // Post creation state
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postCategory, setPostCategory] = useState<CategoryKey>('general')
  const [submitting, setSubmitting] = useState(false)
  const [titleError, setTitleError] = useState('')
  const [contentError, setContentError] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ============================================================
  // Fetch posts
  // ============================================================
  const fetchPosts = () => {
    fetch('/api/community')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // ============================================================
  // Auto-resize textarea
  // ============================================================
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }, [postContent])

  // ============================================================
  // Create post
  // ============================================================
  const handleCreatePost = async () => {
    setTitleError('')
    setContentError('')

    let hasError = false
    if (!postTitle.trim()) {
      setTitleError('El título es obligatorio')
      hasError = true
    }
    if (!postContent.trim()) {
      setContentError('El contenido es obligatorio')
      hasError = true
    }
    if (hasError) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: postTitle.trim(),
          content: postContent.trim(),
          category: postCategory,
        }),
      })

      if (res.ok) {
        toast.success('¡Publicación creada! 🚀')
        setPostTitle('')
        setPostContent('')
        setPostCategory('general')
        fetchPosts()
      } else {
        toast.error('Error al crear la publicación')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // Like post (optimistic)
  // ============================================================
  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    )

    try {
      await fetch(`/api/community/${postId}/like`, { method: 'POST' })
    } catch {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
      )
    }
  }

  // ============================================================
  // Filter posts
  // ============================================================
  const filtered =
    activeFilter === 'Todas'
      ? posts
      : posts.filter((p) => p.category === activeFilter)

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            <div className="relative">
              <Users size={18} className="text-cyan-400" />
              <MessageCircle
                size={10}
                className="text-cyan-300 absolute -top-1 -right-1.5"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Comunidad Espacial
            </h1>
          </div>
        </div>
        <p className="text-white/40 ml-[52px]">
          Comparte, descubre y conecta con otros exploradores
        </p>
      </motion.div>

      {/* Create Post Section */}
      <motion.div
        className="rounded-2xl overflow-hidden relative"
        style={{ ...cardBase, background: 'rgba(255,255,255,0.04)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CardGradientTop color="linear-gradient(90deg, #00d4ff, #7c3aed)" />

        <div className="p-6 space-y-5">
          {/* Section title */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.15)',
              }}
            >
              <PenLine size={16} className="text-cyan-400" />
            </div>
            <h2 className="text-white font-semibold text-lg">
              Crear Publicación
            </h2>
          </div>

          {/* Title input */}
          <div className="space-y-1.5">
            <input
              type="text"
              value={postTitle}
              onChange={(e) => {
                setPostTitle(e.target.value)
                if (titleError) setTitleError('')
              }}
              placeholder="Título de tu publicación"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-200"
            />
            {titleError && (
              <motion.p
                className="text-red-400 text-xs pl-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {titleError}
              </motion.p>
            )}
          </div>

          {/* Content textarea */}
          <div className="space-y-1.5">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={postContent}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setPostContent(e.target.value)
                    if (contentError) setContentError('')
                  }
                }}
                placeholder="¿Qué quieres compartir con la comunidad?"
                rows={3}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-200 resize-none"
                style={{ minHeight: '80px', maxHeight: '160px' }}
              />
              <span
                className={`absolute bottom-2.5 right-3 text-xs font-mono ${
                  postContent.length >= 450
                    ? postContent.length >= 500
                      ? 'text-red-500'
                      : 'text-amber-400'
                    : 'text-white/20'
                }`}
              >
                {postContent.length}/500
              </span>
            </div>
            {contentError && (
              <motion.p
                className="text-red-400 text-xs pl-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {contentError}
              </motion.p>
            )}
          </div>

          {/* Category selector */}
          <div className="space-y-2">
            <p className="text-white/30 text-xs font-medium uppercase tracking-wider">
              Categoría
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {categoryKeys.map((cat) => {
                const cfg = categoryConfig[cat]
                const isActive = postCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setPostCategory(cat)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: isActive
                        ? `${cfg.color}15`
                        : 'rgba(255,255,255,0.03)',
                      border: isActive
                        ? `1px solid ${cfg.color}35`
                        : '1px solid rgba(255,255,255,0.06)',
                      color: isActive ? cfg.color : 'rgba(255,255,255,0.4)',
                      boxShadow: isActive
                        ? `0 0 12px ${cfg.color}10`
                        : 'none',
                    }}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Publish button */}
          <div className="flex justify-end">
            <motion.button
              onClick={handleCreatePost}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  'linear-gradient(135deg, #00d4ff, #7c3aed)',
                boxShadow:
                  '0 4px 20px rgba(0,212,255,0.2), 0 0 30px rgba(124,58,237,0.1)',
              }}
              whileHover={{ scale: 1.02 }}
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {submitting ? 'Publicando...' : 'Publicar'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex flex-wrap items-center gap-2"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filterOptions.map((opt) => {
          const cfg = opt !== 'Todas' ? categoryConfig[opt] : null
          const isActive = activeFilter === opt
          return (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
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
              onMouseEnter={(e) => {
                if (e.currentTarget && !isActive)
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget && !isActive)
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              {opt === 'Todas' && <Sparkles size={13} />}
              {opt !== 'Todas' && cfg && <Sparkles size={13} />}
              {opt === 'Todas' ? 'Todas' : categoryConfig[opt].label}
            </button>
          )
        })}
      </motion.div>

      {/* Loading state */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
            <MessageCircle size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm font-medium">
            ¡Sé el primero en publicar! 🌟
          </p>
          <p className="text-white/25 text-xs mt-1">
            Comparte algo increíble con la comunidad
          </p>
        </motion.div>
      )}

      {/* Posts feed */}
      {!loading && filtered.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userId={userId}
                onLike={handleLike}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
