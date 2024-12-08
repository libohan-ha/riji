import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Failure } from '../types'
import { motion } from 'framer-motion'
import TextareaAutosize from 'react-textarea-autosize'

interface FailureFormProps {
  onSubmit: (failure: Failure) => void
}

export function FailureForm({ onSubmit }: FailureFormProps) {
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const failure: Failure = {
      id: crypto.randomUUID(),
      date: date,
      content: content.trim(),
      createdAt: new Date().toISOString()
    }

    onSubmit(failure)
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
          className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-3 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   shadow-sm hover:shadow-md transition-all duration-300
                   bg-white/50 backdrop-blur-sm"
        />
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="发生了什么不好的事情？"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   shadow-sm hover:shadow-md transition-all duration-300
                   bg-white/50 backdrop-blur-sm resize-none"
          style={{ lineHeight: '1.5' }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 
                   rounded-xl px-6 py-3 text-white font-medium
                   bg-gradient-to-r from-rose-500 to-rose-600
                   hover:from-rose-600 hover:to-rose-700
                   shadow-lg transition-all duration-300"
        >
          <PlusCircle size={20} />
          <span>记录失败</span>
        </motion.button>
      </div>
    </motion.form>
  )
}
