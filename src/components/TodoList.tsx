import { useState, useEffect } from 'react'
import { Todo } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { TimerReset, Trash2, CheckCircle2, Check, X } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

interface TodoListProps {
  todos: Todo[]
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onEdit: (id: string, newContent: string) => void
}

export function TodoList({ todos, onDelete, onComplete, onEdit }: TodoListProps) {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const newTimeLeft: Record<string, number> = {}

      todos.forEach(todo => {
        const createdAt = new Date(todo.createdAt).getTime()
        const timeLimit = 72 * 60 * 60 * 1000 // 72 hours in milliseconds
        const remaining = (createdAt + timeLimit) - now

        newTimeLeft[todo.id] = Math.max(0, remaining)
      })

      setTimeLeft(newTimeLeft)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [todos])

  const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return '已过期'

    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    return `${hours}小时 ${minutes}分钟 ${seconds}秒`
  }

  const getTimeLeftColor = (ms: number) => {
    const hours = ms / (1000 * 60 * 60)
    if (hours <= 12) return 'text-red-500'
    if (hours <= 24) return 'text-orange-500'
    return 'text-blue-500'
  }

  const getProgressWidth = (ms: number) => {
    const totalTime = 72 * 60 * 60 * 1000
    return `${(ms / totalTime) * 100}%`
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditContent(todo.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditContent('')
  }

  const saveEdit = () => {
    if (!editingId || !editContent.trim()) return
    onEdit(editingId, editContent.trim())
    setEditingId(null)
    setEditContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      saveEdit()
    }
    if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {todos.map((todo) => {
          const time = timeLeft[todo.id] || 0
          const timeLeftColor = getTimeLeftColor(time)

          return (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                       hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                <div
                  className="h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: getProgressWidth(time),
                    backgroundColor: getTimeLeftColor(time).replace('text-', 'bg-')
                  }}
                />
              </div>

              <div className="flex items-start gap-4">
                <button
                  onClick={() => onComplete(todo.id)}
                  className="mt-1 text-gray-400 hover:text-green-500 transition-colors"
                >
                  <CheckCircle2 size={20} />
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="space-y-2">
                      <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-lg border border-blue-300 px-3 py-2
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 resize-none bg-white/50"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg
                                   bg-green-500 text-white hover:bg-green-600
                                   transition-colors text-sm"
                        >
                          <Check size={16} />
                          保存
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg
                                   bg-gray-200 text-gray-600 hover:bg-gray-300
                                   transition-colors text-sm"
                        >
                          <X size={16} />
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p 
                      onClick={() => startEditing(todo)}
                      className="text-gray-900 cursor-pointer hover:bg-gray-50 
                               rounded-lg p-2 transition-colors"
                    >
                      {todo.content}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <TimerReset size={16} className={timeLeftColor} />
                    <span className={`text-sm font-medium ${timeLeftColor}`}>
                      {formatTimeLeft(time)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {todos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center my-16 space-y-4"
        >
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-semibold text-gray-700">暂无待办事项</h3>
          <p className="text-gray-500">添加一个新的待办事项开始计时吧！</p>
        </motion.div>
      )}
    </div>
  )
}
