import { useState } from 'react'
import { TimerReset } from 'lucide-react'
import { Todo } from '../types'
import { motion } from 'framer-motion'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'

interface TodoFormProps {
  onSubmit: (todo: Todo) => void
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const todo: Todo = {
      id: crypto.randomUUID(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      completed: false
    }

    onSubmit(todo)
    setContent('')
    toast.success('已添加新的待办事项', {
      description: '72小时倒计时开始！'
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
        <TextareaAutosize
          minRows={1}
          maxRows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="添加新的待办事项..."
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
                   bg-gradient-to-r from-purple-500 to-indigo-500
                   hover:from-purple-600 hover:to-indigo-600
                   shadow-lg transition-all duration-300"
        >
          <TimerReset size={20} />
          <span>添加待办</span>
        </motion.button>
      </div>
    </motion.form>
  )
}
