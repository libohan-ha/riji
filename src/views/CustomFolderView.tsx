import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSidebar } from '../contexts/SidebarContext'
import { useFolder } from '../contexts/FolderContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Plus, X, StickyNote, ListTodo } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { FolderItemList } from '../components/FolderItemList'
import { toast } from 'sonner'

export function CustomFolderView() {
  const { folderName } = useParams<{ folderName: string }>()
  const { items } = useSidebar()
  const { folders, addItem, removeItem, toggleTodo, editItem } = useFolder()
  const [isAdding, setIsAdding] = useState(false)
  const [newItemType, setNewItemType] = useState<'note' | 'todo'>('note')
  const [newContent, setNewContent] = useState('')
  
  // Find the corresponding folder item
  const folder = items.find(item => item.label === folderName)
  const folderData = folders.find(f => f.folderName === folderName)

  if (!folder) {
    return (
      <div className="text-center my-16">
        <h2 className="text-2xl font-bold text-gray-800">找不到该文件夹</h2>
        <p className="text-gray-600 mt-2">该文件夹可能已被删除或重命名</p>
      </div>
    )
  }

  const handleAdd = () => {
    if (!newContent.trim()) return

    addItem(folderName!, {
      type: newItemType,
      content: newContent.trim(),
      completed: false
    })

    setNewContent('')
    setIsAdding(false)
    toast.success(newItemType === 'note' ? '笔记已添加' : '待办已添加')
  }

  const handleEdit = (itemId: string, newContent: string) => {
    editItem(folderName!, itemId, newContent)
    toast.success('修改已保存')
  }

  const handleDelete = (itemId: string) => {
    removeItem(folderName!, itemId)
    toast.success('已删除')
  }

  const handleToggle = (itemId: string) => {
    toggleTodo(folderName!, itemId)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">{folder.label}</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-gradient-to-r from-blue-500 to-blue-600
                     text-white shadow-lg hover:shadow-xl
                     transition-all duration-300"
          >
            <Plus size={20} />
            <span>添加内容</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setNewItemType('note')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg
                          ${newItemType === 'note' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                          } transition-colors`}
              >
                <StickyNote size={20} />
                <span>笔记</span>
              </button>
              <button
                onClick={() => setNewItemType('todo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg
                          ${newItemType === 'todo' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                          } transition-colors`}
              >
                <ListTodo size={20} />
                <span>待办</span>
              </button>
            </div>

            <TextareaAutosize
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={newItemType === 'note' ? "写下你的笔记..." : "添加一个待办事项..."}
              className="w-full rounded-lg border border-gray-200 p-3
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       resize-none"
              minRows={3}
              maxRows={8}
              autoFocus
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsAdding(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-gray-100 text-gray-600 hover:bg-gray-200
                         transition-colors"
              >
                <X size={20} />
                <span>取消</span>
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-blue-500 text-white hover:bg-blue-600
                         transition-colors"
              >
                <Plus size={20} />
                <span>添加</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FolderItemList
        items={folderData?.items || []}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />
    </div>
  )
}
