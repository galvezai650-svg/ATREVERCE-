'use client'

import React from 'react'

// Gradient top line component for cards
export default function CardGradientTop({ color = 'linear-gradient(90deg, #00d4ff, #7c3aed)' }: { color?: string }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60"
      style={{ background: color }}
    />
  )
}
