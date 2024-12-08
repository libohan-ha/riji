import { BookX, Trash2 } from 'lucide-react'
import { Failure } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { EditDrawer } from './EditDrawer'

interface FailureListProps {
  failures: Failure[]
  onDelete: (id: string) => void
  onEdit?: (id: string, newContent: string) => void
}

export function FailureList({ failures, onDelete, onEdit }: FailureListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const sortedFailures = [...failures].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const groupedFailures = sortedFailures.reduce((groups, failure) => {
    const date = failure.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(failure)
    return groups
  }, {} as Record<string, Failure[]>)

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date(dateStr))
  }

  const startEditing = (failure: Failure) => {
    setEditingId(failure.id)
    setEditContent(failure.content)
    setIsDrawerOpen(true)
  }

  const handleSave = () => {
    if (editingId && onEdit && editContent.trim()) {
      onEdit(editingId, editContent.trim())
      setEditingId(null)
      setIsDrawerOpen(false)
    }
  }

  if (failures.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center my-16 space-y-4"
      >
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-semibold text-gray-700">还没有记录</h3>
        <p className="text-gray-500">每个失败都是成长的机会</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedFailures).map(([date, dailyFailures]) => (
        <div key={date} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 pl-2">
            {formatDate(date)}
          </h2>
          <AnimatePresence>
            {dailyFailures.map((failure) => (
              <motion.div
                key={failure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 
                         hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-rose-100 p-2 rounded-xl">
                    <BookX className="text-rose-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <p 
                      className="text-gray-800 text-lg cursor-pointer 
                               hover:bg-rose-50 rounded-lg p-2 transition-colors"
                      onClick={() => startEditing(failure)}
                    >
                      {failure.content}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(failure.id)}
                    className="text-gray-400 hover:text-rose-500 transition-colors 
                             p-2 rounded-xl hover:bg-rose-50"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}

      <EditDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setEditingId(null)
        }}
        value={editContent}
        onChange={setEditContent}
        onSave={handleSave}
        title="编辑失败记录"
        placeholder="在这里编辑你的失败记录..."
      />
    </div>
  )
}
