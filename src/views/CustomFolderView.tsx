import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSidebar } from '../contexts/SidebarContext'
import { useFolder } from '../contexts/FolderContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Plus, X, Check, Trash2, Edit3, StickyNote, ListTodo } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'

export function CustomFolderView() {
  const { folderName } = useParams<{ folderName: string }>()
  const { items } = useSidebar()
  const { folders, addItem, removeItem, toggleTodo, editItem } = useFolder()
  const [isAdding, setIsAdding] = useState(false)
  const [newItemType, setNewItemType] = useState<'note' | 'todo'>('note')
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  
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

  const handleEdit = (itemId: string) => {
    if (!editContent.trim()) return
    editItem(folderName!, itemId, editContent.trim())
    setEditingId(null)
    setEditContent('')
    toast.success('修改已保存')
  }

  const startEdit = (content: string, itemId: string) => {
    setEditingId(itemId)
    setEditContent(content)
  }

  const handleDelete = (itemId: string) => {
    removeItem(folderName!, itemId)
    toast.success('已删除')
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

      <div className="space-y-4">
        {folderData?.items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100
                     hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <TextareaAutosize
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               resize-none"
                      minRows={2}
                      maxRows={5}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 text-green-500 hover:text-green-700"
                      >
                        <Check size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    {item.type === 'todo' && (
                      <button
                        onClick={() => toggleTodo(folderName!, item.id)}
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
                    )}
                    <p
                      className={`whitespace-pre-wrap ${
                        item.type === 'todo' && item.completed 
                          ? 'text-gray-400 line-through' 
                          : 'text-gray-800'
                      }`}
                    >
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item.content, item.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-gray-400 hover:text-rose-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {(!folderData || folderData.items.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <FolderOpen size={48} className="mx-auto mb-4" />
            <p>还没有添加任何内容</p>
            <p className="text-sm mt-1">点击上方的"添加内容"按钮开始使用</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
