import { LightbulbIcon, Trash2, Clock, ChevronDown, ChevronUp, Edit } from 'lucide-react'
import { Idea } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { EditDrawer } from './EditDrawer'

interface IdeaListProps {
  ideas: Idea[]
  onDelete: (id: string) => void
  onEdit?: (id: string, newContent: string) => void
}

export function IdeaList({ ideas, onDelete, onEdit }: IdeaListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const sortedIdeas = [...ideas].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(date)
  }

  const startEditing = (idea: Idea, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(idea.id)
    setEditContent(idea.content)
    setIsDrawerOpen(true)
  }

  const handleSave = () => {
    if (editingId && editContent.trim() && onEdit) {
      onEdit(editingId, editContent.trim())
      setEditingId(null)
      setIsDrawerOpen(false)
    }
  }

  const toggleExpand = (id: string) => {
    const newExpandedIds = new Set(expandedIds)
    if (expandedIds.has(id)) {
      newExpandedIds.delete(id)
    } else {
      newExpandedIds.add(id)
    }
    setExpandedIds(newExpandedIds)
  }

  const truncateContent = (content: string) => {
    const firstLine = content.split('\n')[0]
    const maxLength = 50
    if (firstLine.length <= maxLength) return firstLine
    return firstLine.slice(0, maxLength) + '...'
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  if (ideas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center my-16 space-y-4"
      >
        <div className="text-6xl mb-4">💡</div>
        <h3 className="text-xl font-semibold text-gray-700">还没有灵感记录</h3>
        <p className="text-gray-500">记录下你的第一个灵感吧！</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {sortedIdeas.map((idea) => {
          const isExpanded = expandedIds.has(idea.id)
          return (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`bg-white rounded-lg shadow-sm border border-gray-100 
                       hover:shadow-md transition-all overflow-hidden
                       ${isExpanded ? 'border-blue-100' : ''}`}
            >
              <div
                className="flex items-start gap-3 p-3 cursor-pointer select-none"
                onClick={() => toggleExpand(idea.id)}
              >
                <LightbulbIcon 
                  className={`mt-1 flex-shrink-0 transition-colors
                           ${isExpanded ? 'text-blue-500' : 'text-yellow-500'}`} 
                  size={20} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-gray-900 break-words transition-colors
                                ${isExpanded ? '' : 'line-clamp-1'}`}>
                      {isExpanded ? idea.content : truncateContent(idea.content)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => startEditing(idea, e)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(idea.id, e)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="text-gray-400 transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatDateTime(idea.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      <EditDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setEditingId(null)
        }}
        value={editContent}
        onChange={setEditContent}
        onSave={handleSave}
        title="编辑灵感"
        placeholder="在这里编辑你的灵感..."
      />
    </div>
  )
} 