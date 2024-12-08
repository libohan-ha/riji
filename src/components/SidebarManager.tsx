import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, RotateCcw, FolderPlus } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'

const icons = [
  'Star', 'Heart', 'Book', 'Calendar', 'Music', 'Image', 'Film',
  'Coffee', 'Smile', 'Target', 'Map', 'Compass'
]

interface SidebarManagerProps {
  onClose: () => void
}

export function SidebarManager({ onClose }: SidebarManagerProps) {
  const { items, addItem, removeItem, resetToDefault } = useSidebar()
  const [newItemForm, setNewItemForm] = useState({
    label: '',
    icon: 'Star'
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemForm.label) {
      setError('请输入文件夹名称')
      return
    }

    // Check for duplicates
    if (items.some(item => item.label === newItemForm.label)) {
      setError('文件夹名称已存在')
      return
    }

    // Don't allow labels that match default items
    const reservedNames = ['今日成就', '明日计划', '灵感记录']
    if (reservedNames.includes(newItemForm.label)) {
      setError('不能使用系统预设的名称')
      return
    }

    addItem({
      label: newItemForm.label,
      icon: newItemForm.icon
    })

    setNewItemForm({
      label: '',
      icon: 'Star'
    })
    setError('')
  }

  // Filter out default items that can't be deleted
  const customItems = items.filter(item => 
    !['今日成就', '明日计划', '灵感记录'].includes(item.label)
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">自定义文件夹</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              文件夹名称
            </label>
            <input
              type="text"
              value={newItemForm.label}
              onChange={e => {
                setNewItemForm(prev => ({ ...prev, label: e.target.value }))
                setError('')
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入新文件夹名称..."
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择图标
            </label>
            <select
              value={newItemForm.icon}
              onChange={e => setNewItemForm(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {icons.map(icon => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
          >
            <FolderPlus size={20} />
            创建文件夹
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">自定义文件夹列表</h3>
            {customItems.length > 0 && (
              <button
                onClick={resetToDefault}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                重置
              </button>
            )}
          </div>
          
          {customItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderPlus size={32} className="mx-auto mb-2 opacity-50" />
              <p>还没有创建自定义文件夹</p>
            </div>
          ) : (
            <AnimatePresence>
              {customItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{item.label}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}
