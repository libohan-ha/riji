import { useState } from 'react'
import { motion } from 'framer-motion'
import { Idea } from '../types'
import { toast } from 'sonner'

interface IdeaFormProps {
  onAdd: (idea: Idea) => void
}

export function IdeaForm({ onAdd }: IdeaFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const idea: Idea = {
      id: crypto.randomUUID(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    }

    onAdd(idea)
    setContent('')
    toast.success('灵感已记录')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="记录一个新的灵感..."
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          添加
        </button>
      </div>
    </motion.form>
  )
}
