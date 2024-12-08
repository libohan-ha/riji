import { Trash2, Circle, CheckCircle2 } from 'lucide-react'
import { Plan } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { EditDrawer } from './EditDrawer'

interface PlanListProps {
  plans: Plan[]
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onEdit?: (id: string, newContent: string) => void
}

export function PlanList({ plans, onDelete, onToggle, onEdit }: PlanListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const startEditing = (plan: Plan) => {
    setEditingId(plan.id)
    setEditContent(plan.content)
    setIsDrawerOpen(true)
  }

  const handleSave = () => {
    if (editingId && editContent.trim() && onEdit) {
      onEdit(editingId, editContent.trim())
      setEditingId(null)
      setIsDrawerOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            whileHover={{ scale: 1.02 }}
            className={`
              bg-white rounded-lg p-4 shadow-sm border transition-all duration-300
              ${plan.completed 
                ? 'border-green-200 bg-green-50/50' 
                : 'border-gray-100 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggle(plan.id)}
                className={`mt-1 transition-colors duration-300 ${
                  plan.completed 
                    ? 'text-green-500 hover:text-green-600' 
                    : 'text-gray-400 hover:text-green-600'
                }`}
              >
                {plan.completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              <div className="flex-1">
                <p 
                  className={`transition-all duration-300 cursor-pointer 
                            hover:bg-gray-50 rounded-lg p-2 ${
                    plan.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                  onClick={() => !plan.completed && startEditing(plan)}
                >
                  {plan.content}
                </p>
              </div>
              <button
                onClick={() => onDelete(plan.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                aria-label="删除"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
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
        title="编辑计划"
        placeholder="在这里编辑你的计划..."
      />
    </div>
  )
}
