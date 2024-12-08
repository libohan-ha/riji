import { useState, useEffect } from 'react'
import { Idea } from '../types'
import { motion } from 'framer-motion'
import { Plus, LightbulbIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { IdeaList } from '../components/IdeaList'
import { toast } from 'sonner'

export function IdeasView() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState('')

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
    toast.success('灵感已记录')
  }

  const handleDeleteIdea = (id: string) => {
    const newIdeas = ideas.filter(idea => idea.id !== id)
    setIdeas(newIdeas)
    localStorage.setItem('ideas', JSON.stringify(newIdeas))
    toast.success('灵感已删除')
  }

  const handleEditIdea = (id: string, newContent: string) => {
    const newIdeas = ideas.map(idea => 
      idea.id === id 
        ? { ...idea, content: newContent }
        : idea
    )
    setIdeas(newIdeas)
    localStorage.setItem('ideas', JSON.stringify(newIdeas))
    toast.success('灵感已更新')
  }

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
            <div className="flex-1 relative">
              <div className="absolute left-4 top-3 text-yellow-500">
                <LightbulbIcon size={20} />
              </div>
              <TextareaAutosize
                minRows={1}
                maxRows={5}
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="记录你的想法..."
                className="w-full rounded-lg border border-gray-300 pl-12 pr-4 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         resize-none"
                style={{ lineHeight: '1.5' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newIdea.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 
                       rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              <Plus size={20} />
              <span>添加</span>
            </button>
          </div>
        </form>
      </motion.div>

      <IdeaList 
        ideas={ideas} 
        onDelete={handleDeleteIdea}
        onEdit={handleEditIdea}
      />
    </div>
  )
}
