import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Achievement } from '../types'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import TextareaAutosize from 'react-textarea-autosize'

interface AchievementFormProps {
  onSubmit: (achievement: Achievement) => void
}

export function AchievementForm({ onSubmit }: AchievementFormProps) {
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const achievement: Achievement = {
      id: crypto.randomUUID(),
      date: date,
      content: content.trim(),
      createdAt: new Date().toISOString()
    }

    onSubmit(achievement)
    setContent('')

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#FFE66D', '#FF6B6B', '#4ECDC4']
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="mb-8 space-y-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-3 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   shadow-sm hover:shadow-md transition-all duration-300
                   bg-white/50 backdrop-blur-sm"
        />
        <TextareaAutosize
          minRows={1}
          maxRows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你今天的成就..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   shadow-sm hover:shadow-md transition-all duration-300
                   bg-white/50 backdrop-blur-sm resize-none"
          style={{ lineHeight: '1.5' }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 
                   rounded-xl px-6 py-3 text-white font-medium
                   btn-primary shadow-lg"
        >
          <PlusCircle size={20} />
          <span>记录成就</span>
        </motion.button>
      </div>
    </motion.form>
  )
}
