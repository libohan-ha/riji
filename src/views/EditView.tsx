import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TextareaAutosize from 'react-textarea-autosize'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

export function EditView() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!type || !id || isInitialized) return
    
    const items = JSON.parse(localStorage.getItem(type) || '[]')
    const item = items.find((i: any) => i.id === id)
    if (item) {
      setContent(item.content || '')
      setTitle(item.title || '')
      setIsInitialized(true)
    }
  }, [type, id, isInitialized])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setContent(e.target.value)
  }, [])

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTitle(e.target.value)
  }, [])

  const handleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!type || !id) return

    const items = JSON.parse(localStorage.getItem(type) || '[]')
    const itemIndex = items.findIndex((i: any) => i.id === id)
    
    if (itemIndex !== -1) {
      items[itemIndex] = {
        ...items[itemIndex],
        content,
        title,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(type, JSON.stringify(items))
      toast.success('保存成功')
    }
  }, [type, id, content, title])

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    navigate(-1)
  }, [navigate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
    }
  }, [])

  const getTypeName = useCallback(() => {
    switch (type) {
      case 'achievements':
        return '成就'
      case 'plans':
        return '计划'
      case 'ideas':
        return '灵感'
      case 'todos':
        return '待办'
      case 'failures':
        return '失败'
      default:
        return '记录'
    }
  }, [type])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white p-4 pt-20 lg:pt-4"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-4xl mx-auto">
        <div className="fixed top-0 left-0 right-0 bg-white z-10 p-4 lg:relative lg:bg-transparent lg:p-0 shadow-md lg:shadow-none">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
              type="button"
            >
              <ArrowLeft size={20} className="mr-2" />
              返回
            </button>
            <button
              onClick={handleSave}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              type="button"
            >
              <Save size={20} className="mr-2" />
              保存
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          placeholder={`${getTypeName()}标题`}
          className="w-full text-2xl font-bold mb-4 p-2 border-none focus:outline-none focus:ring-0"
        />

        <TextareaAutosize
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={`在这里记录你的${getTypeName()}内容...`}
          className="w-full min-h-[300px] p-2 border-none focus:outline-none focus:ring-0 resize-none"
        />
      </div>
    </motion.div>
  )
}
