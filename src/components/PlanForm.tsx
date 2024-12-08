import { useState } from 'react'
import { ListPlus } from 'lucide-react'
import { Plan } from '../types'
import { motion } from 'framer-motion'
import TextareaAutosize from 'react-textarea-autosize'

interface PlanFormProps {
  onSubmit: (plan: Plan) => void
}

export function PlanForm({ onSubmit }: PlanFormProps) {
  const [content, setContent] = useState('')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [date, setDate] = useState(tomorrow.toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const plan: Plan = {
      id: crypto.randomUUID(),
      date: date,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      completed: false
    }

    onSubmit(plan)
    setContent('')
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
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <TextareaAutosize
          minRows={1}
          maxRows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="明天想要完成什么？"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          style={{ lineHeight: '1.5' }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        >
          <ListPlus size={20} />
          <span>添加计划</span>
        </motion.button>
      </div>
    </motion.form>
  )
}
