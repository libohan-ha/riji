import { useState, useEffect } from 'react'
import { Todo } from '../types'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export function TodosView() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const handleAddTodo = (todo: Todo) => {
    const newTodos = [...todos, todo]
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }

  const handleDeleteTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }

  const handleComplete = (id: string) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: true } : todo
    )
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))

    const todo = todos.find(t => t.id === id)
    if (todo) {
      toast.success('完成任务！', {
        description: todo.content
      })
    }
  }

  const handleEdit = (id: string, newContent: string) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, content: newContent } : todo
    )
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
    
    toast.success('已更新待办事项', {
      description: newContent
    })
  }

  // Filter out completed and expired todos
  const activeTodos = todos.filter(todo => {
    if (todo.completed) return false
    
    const createdAt = new Date(todo.createdAt).getTime()
    const now = new Date().getTime()
    const timeLimit = 72 * 60 * 60 * 1000 // 72 hours in milliseconds
    return (now - createdAt) <= timeLimit
  })

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">限时待办</h1>
        <p className="text-gray-600">72小时内必须完成的任务，抓紧时间！</p>
      </motion.div>

      <TodoForm onSubmit={handleAddTodo} />
      <TodoList
        todos={activeTodos}
        onDelete={handleDeleteTodo}
        onComplete={handleComplete}
        onEdit={handleEdit}
      />
    </div>
  )
}
