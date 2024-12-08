export interface Achievement {
  id: string
  date: string
  content: string
  createdAt: string
}

export interface Plan {
  id: string
  date: string
  content: string
  createdAt: string
  completed: boolean
}

export interface Idea {
  id: string
  content: string
  createdAt: string
}

export interface Todo {
  id: string
  content: string
  createdAt: string
  completed: boolean
}

export interface Failure {
  id: string
  date: string
  content: string
  createdAt: string
}

export interface BackgroundTheme {
  id: string
  name: string
  gradient: string
  pattern?: string
}

export interface SidebarFolder {
  id: string
  label: string
  icon: string
}

export interface FolderItem {
  id: string
  type: 'note' | 'todo'
  content: string
  completed?: boolean
  createdAt: string
}

export interface FolderData {
  id: string
  folderName: string
  items: FolderItem[]
}
