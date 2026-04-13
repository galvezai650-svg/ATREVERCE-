// ============================================================
// Shared Styles & Helpers
// ============================================================

export const cardBase = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(24px)',
}

export const cardHoverStyle = (color: string = 'rgba(0,212,255,0.4)') => ({
  boxShadow: `0 0 30px ${color.replace('0.4', '0.08')}, 0 8px 32px rgba(0,0,0,0.3)`,
})

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}
