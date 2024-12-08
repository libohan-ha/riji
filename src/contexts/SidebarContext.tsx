import { createContext, useContext, useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: any // Using any for Lucide icon type
  path?: string
}

interface SidebarContextType {
  items: SidebarItem[]
  isOpen: boolean
  toggleSidebar: () => void
  addItem: (item: Omit<SidebarItem, 'id'>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, item: Partial<SidebarItem>) => void
  resetToDefault: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SidebarItem[]>(() => {
    const saved = localStorage.getItem('sidebarItems')
    return saved ? JSON.parse(saved) : []
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('sidebarItems', JSON.stringify(items))
  }, [items])

  const toggleSidebar = () => setIsOpen(prev => !prev)

  const addItem = (item: Omit<SidebarItem, 'id'>) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      path: `/folder/${encodeURIComponent(item.label)}`,
      icon: Star // Default icon
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateItem = (id: string, updatedFields: Partial<SidebarItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedFields } : item
    ))
  }

  const resetToDefault = () => {
    setItems([])
  }

  return (
    <SidebarContext.Provider 
      value={{ 
        items, 
        isOpen,
        toggleSidebar,
        addItem, 
        removeItem, 
        updateItem, 
        resetToDefault 
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
