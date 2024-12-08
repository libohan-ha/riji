import { motion, AnimatePresence } from 'framer-motion'
import { X, Save } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'

interface EditDrawerProps {
  isOpen: boolean
  onClose: () => void
  value: string
  onChange: (value: string) => void
  onSave: () => void
  title?: string
  placeholder?: string
}

export function EditDrawer({
  isOpen,
  onClose,
  value,
  onChange,
  onSave,
  title = '编辑内容',
  placeholder = '在这里输入...'
}: EditDrawerProps) {
  const handleSave = () => {
    onSave()
    onClose()
    toast.success('保存成功')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* 抽屉内容 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl z-50 
                     min-h-[60vh] max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* 顶部栏 */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Save size={20} />
                    保存
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* 编辑区域 */}
              <TextareaAutosize
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[200px] p-4 text-lg border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                         bg-gray-50"
                autoFocus
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 