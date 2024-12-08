import { createContext, useContext, useState, useEffect } from 'react'
import { FolderItem, FolderData } from '../types'

interface FolderContextType {
  folders: FolderData[]
  addItem: (folderName: string, item: Omit<FolderItem, 'id' | 'createdAt'>) => void
  removeItem: (folderName: string, itemId: string) => void
  toggleTodo: (folderName: string, itemId: string) => void
  editItem: (folderName: string, itemId: string, content: string) => void
}

const FolderContext = createContext<FolderContextType | undefined>(undefined)

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<FolderData[]>(() => {
    const saved = localStorage.getItem('folderData')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('folderData', JSON.stringify(folders))
  }, [folders])

  const addItem = (folderName: string, item: Omit<FolderItem, 'id' | 'createdAt'>) => {
    setFolders(prevFolders => {
      const newFolders = [...prevFolders]
      const folderIndex = newFolders.findIndex(f => f.folderName === folderName)
      
      if (folderIndex === -1) {
        // Create new folder if it doesn't exist
        newFolders.push({
          id: crypto.randomUUID(),
          folderName,
          items: [{
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
          }]
        })
      } else {
        // Add item to existing folder
        newFolders[folderIndex].items.push({
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        })
      }
      
      return newFolders
    })
  }

  const removeItem = (folderName: string, itemId: string) => {
    setFolders(prevFolders => {
      return prevFolders.map(folder => {
        if (folder.folderName === folderName) {
          return {
            ...folder,
            items: folder.items.filter(item => item.id !== itemId)
          }
        }
        return folder
      })
    })
  }

  const toggleTodo = (folderName: string, itemId: string) => {
    setFolders(prevFolders => {
      return prevFolders.map(folder => {
        if (folder.folderName === folderName) {
          return {
            ...folder,
            items: folder.items.map(item => {
              if (item.id === itemId && item.type === 'todo') {
                return { ...item, completed: !item.completed }
              }
              return item
            })
          }
        }
        return folder
      })
    })
  }

  const editItem = (folderName: string, itemId: string, content: string) => {
    setFolders(prevFolders => {
      return prevFolders.map(folder => {
        if (folder.folderName === folderName) {
          return {
            ...folder,
            items: folder.items.map(item => {
              if (item.id === itemId) {
                return { ...item, content }
              }
              return item
            })
          }
        }
        return folder
      })
    })
  }

  return (
    <FolderContext.Provider 
      value={{ 
        folders,
        addItem,
        removeItem,
        toggleTodo,
        editItem
      }}
    >
      {children}
    </FolderContext.Provider>
  )
}

export function useFolder() {
  const context = useContext(FolderContext)
  if (context === undefined) {
    throw new Error('useFolder must be used within a FolderProvider')
  }
  return context
}
