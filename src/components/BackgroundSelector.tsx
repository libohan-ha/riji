import { useState } from 'react'
import { Check } from 'lucide-react'
import { BackgroundTheme } from '../types'
import { motion } from 'framer-motion'

const backgroundThemes: BackgroundTheme[] = [
  {
    id: 'default',
    name: '默认渐变',
    gradient: 'linear-gradient(135deg, #f6f8ff 0%, #f0f4ff 100%)',
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234a72df' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`
  },
  {
    id: 'sunset',
    name: '日落渐变',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 'ocean',
    name: '海洋渐变',
    gradient: 'linear-gradient(135deg, #e0f7ff 0%, #b6e3ff 100%)'
  },
  {
    id: 'forest',
    name: '森林渐变',
    gradient: 'linear-gradient(135deg, #e6ffed 0%, #b3f0c9 100%)'
  },
  {
    id: 'lavender',
    name: '薰衣草渐变',
    gradient: 'linear-gradient(135deg, #f3e7ff 0%, #e4c7ff 100%)'
  }
]

interface BackgroundSelectorProps {
  onClose: () => void
}

export function BackgroundSelector({ onClose }: BackgroundSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('backgroundTheme') || 'default'
  })

  const applyTheme = (themeId: string) => {
    const theme = backgroundThemes.find(t => t.id === themeId)
    if (!theme) return

    const body = document.body

    // Reset previous styles
    body.style.removeProperty('background')
    body.style.removeProperty('background-image')

    // Apply new styles
    if (theme.pattern) {
      // If theme has both gradient and pattern
      body.style.backgroundImage = `${theme.gradient}, ${theme.pattern}`
    } else {
      // If theme only has gradient
      body.style.background = theme.gradient
    }

    body.style.backgroundAttachment = 'fixed'
    body.style.backgroundSize = theme.pattern ? 'cover, 200px 200px' : 'cover'
    body.style.transition = 'all 0.5s ease'

    // Save to localStorage
    localStorage.setItem('backgroundTheme', themeId)
    setSelectedTheme(themeId)
  }

  const handleSelectTheme = (themeId: string) => {
    applyTheme(themeId)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">选择背景主题</h2>
        <div className="grid grid-cols-2 gap-4">
          {backgroundThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={`
                relative h-24 rounded-xl transition-all duration-300
                ${selectedTheme === theme.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'}
              `}
              style={{
                background: theme.gradient,
                backgroundImage: theme.pattern ? `${theme.gradient}, ${theme.pattern}` : theme.gradient,
                backgroundSize: theme.pattern ? 'cover, 100px 100px' : 'cover'
              }}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <Check size={16} className="text-blue-500" />
                </div>
              )}
              <span className="absolute bottom-2 left-2 text-sm font-medium text-gray-800 bg-white/80 px-2 py-1 rounded-lg">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Export themes for use in other components
export { backgroundThemes }
