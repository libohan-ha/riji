import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Trophy, ListTodo, LightbulbIcon, Plus, TimerReset, Frown, FolderPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from '../contexts/SidebarContext'
import { SidebarManager } from './SidebarManager'

const defaultNavItems = [
  { id: '1', icon: Trophy, label: '今日成就', path: '/' },
  { id: '2', icon: ListTodo, label: '明日计划', path: '/plans' },
  { id: '3', icon: LightbulbIcon, label: '灵感记录', path: '/ideas' },
  { id: '4', icon: TimerReset, label: '限时待办', path: '/todos' },
  { id: '5', icon: Frown, label: '失败日记', path: '/failures' },
]

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const [showManager, setShowManager] = useState(false)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
        aria-label={isOpen ? '关闭侧边栏' : '打开侧边栏'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence mode="wait" initial={false}>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black lg:hidden"
              onClick={toggleSidebar}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg lg:static lg:z-auto"
            >
              <SidebarContent onManage={() => setShowManager(true)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block w-64 bg-white shadow-lg">
        <SidebarContent onManage={() => setShowManager(true)} />
      </aside>

      <AnimatePresence>
        {showManager && (
          <SidebarManager onClose={() => setShowManager(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

interface SidebarContentProps {
  onManage: () => void
}

function SidebarContent({ onManage }: SidebarContentProps) {
  const { items } = useSidebar()
  
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold">WinDaily</h1>
        <button
          onClick={onManage}
          className="rounded-lg p-2 hover:bg-slate-100"
          aria-label="管理文件夹"
        >
          <Plus size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {defaultNavItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg px-2 py-2 hover:bg-slate-100 ${
                isActive ? 'bg-slate-100 font-medium' : ''
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={`/folder/${item.label}`}
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg px-2 py-2 hover:bg-slate-100 ${
                isActive ? 'bg-slate-100 font-medium' : ''
              }`
            }
          >
            <FolderPlus size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
