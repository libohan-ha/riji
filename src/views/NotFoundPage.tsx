import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col items-center gap-4">
          <FileQuestion size={64} className="text-blue-500/50" />
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-500/20 to-blue-600/20 bg-clip-text text-transparent">
            404
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">找不到该页面</h1>
          <p className="text-gray-500">该页面可能已被删除、移动或不存在</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 text-white rounded-xl btn-primary transform transition hover:scale-105"
        >
          返回首页
        </button>
      </motion.div>
    </div>
  )
}
