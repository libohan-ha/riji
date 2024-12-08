import { useState, useEffect } from 'react'
import { Idea } from '../types'
import { motion } from 'framer-motion'
import { LightbulbIcon, Trash2, Plus, Clock, Check, X } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

export function IdeasView() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas')
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas))
    }
  }, [])

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIdea.trim()) return

    const idea: Idea = {
      id: crypto.randomUUID(),
      content: newIdea.trim(),
      createdAt: new Date().toISOString()
    }

    const newIdeas = [...ideas, idea]
    setIdeas(newIdeas)
    localStorage.setItem('ideas', JSON.stringify(newIdeas))
    setNewIdea('')
  }

  const handleDeleteIdea = (id: string) => {
    const newIdeas = ideas.filter(idea => idea.id !== id)
    setIdeas(newIdeas)
    localStorage.setItem('ideas', JSON.stringify(newIdeas))
  }

  const startEditing = (idea: Idea) => {
    setEditingId(idea.id)
    setEditContent(idea.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditContent('')
  }

  const saveEdit = () => {
    if (!editingId || !editContent.trim()) return

    const newIdeas = ideas.map(idea => 
      idea.id === editingId 
        ? { ...idea, content: editContent.trim() }
        : idea
    )
    setIdeas(newIdeas)
    localStorage.setItem('ideas', JSON.stringify(newIdeas))
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

  // Sort ideas by creation time, newest first
  const sortedIdeas = [...ideas].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">灵感记录</h1>
        <p className="text-gray-600">捕捉每一个闪现的灵感！</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <form onSubmit={handleAddIdea} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <TextareaAutosize
              minRows={1}
              maxRows={5}
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="记录你的想法..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       resize-none"
              style={{ lineHeight: '1.5' }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <Plus size={20} />
              <span>添加</span>
            </button>
          </div>
        </form>
      </motion.div>

      <div className="space-y-4">
        {sortedIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <LightbulbIcon className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                {editingId === idea.id ? (
                  <div className="flex flex-col gap-2">
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
                    className="text-gray-900 break-words whitespace-pre-wrap
                             cursor-pointer hover:bg-gray-50 rounded-lg p-2
                             transition-colors"
                    onClick={() => startEditing(idea)}
                  >
                    {idea.content}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{formatDateTime(idea.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteIdea(idea.id)}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
