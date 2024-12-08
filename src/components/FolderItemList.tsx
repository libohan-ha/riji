import { StickyNote, ListTodo, Trash2, Edit, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { FolderItem } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { EditDrawer } from './EditDrawer'

interface FolderItemListProps {
  items: FolderItem[]
  onDelete: (id: string) => void
  onEdit: (id: string, newContent: string) => void
  onToggle: (id: string) => void
}

export function FolderItemList({ items, onDelete, onEdit, onToggle }: FolderItemListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const sortedItems = [...items].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const startEditing = (item: FolderItem, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(item.id)
    setEditContent(item.content)
    setIsDrawerOpen(true)
  }

  const handleSave = () => {
    if (editingId && editContent.trim()) {
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle(id)
  }

  const truncateContent = (content: string) => {
    const firstLine = content.split('\n')[0]
    const maxLength = 50
    if (firstLine.length <= maxLength) return firstLine
    return firstLine.slice(0, maxLength) + '...'
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500"
      >
        <StickyNote size={48} className="mx-auto mb-4 opacity-50" />
        <p>还没有添加任何内容</p>
        <p className="text-sm mt-1">点击上方的"添加内容"按钮开始使用</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {sortedItems.map((item) => {
          const isExpanded = expandedIds.has(item.id)
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`bg-white rounded-lg shadow-sm border border-gray-100 
                       hover:shadow-md transition-all overflow-hidden
                       ${isExpanded ? 'border-blue-100' : ''}`}
            >
              <div
                className="flex items-start gap-3 p-3 cursor-pointer select-none"
                onClick={() => toggleExpand(item.id)}
              >
                {item.type === 'todo' ? (
                  <button
                    onClick={(e) => handleToggle(item.id, e)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 
                             ${item.completed 
                               ? 'bg-green-500 border-green-500' 
                               : 'border-gray-300'
                             } transition-colors`}
                  >
                    {item.completed && (
                      <Check size={16} className="text-white" />
                    )}
                  </button>
                ) : (
                  <StickyNote 
                    className={`mt-1 flex-shrink-0 transition-colors
                             ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`}
                    size={20} 
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-gray-900 break-words transition-colors
                                ${isExpanded ? '' : 'line-clamp-1'}
                                ${item.type === 'todo' && item.completed 
                                  ? 'text-gray-400 line-through' 
                                  : ''}`}>
                      {isExpanded ? item.content : truncateContent(item.content)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => startEditing(item, e)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="text-gray-400 transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
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
        title="编辑内容"
        placeholder="在这里编辑..."
      />
    </div>
  )
} 