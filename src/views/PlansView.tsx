import { useState, useEffect } from 'react'
import { Plan, Achievement } from '../types'
import { PlanForm } from '../components/PlanForm'
import { PlanList } from '../components/PlanList'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

export function PlansView() {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    const savedPlans = localStorage.getItem('plans')
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans))
    }
  }, [])

  const handleAddPlan = (plan: Plan) => {
    const newPlans = [...plans, plan]
    setPlans(newPlans)
    localStorage.setItem('plans', JSON.stringify(newPlans))
  }

  const handleDeletePlan = (id: string) => {
    const newPlans = plans.filter(plan => plan.id !== id)
    setPlans(newPlans)
    localStorage.setItem('plans', JSON.stringify(newPlans))
  }

  const handleTogglePlan = (id: string) => {
    const plan = plans.find(p => p.id === id)
    if (!plan) return

    // If already completed, just toggle back
    if (plan.completed) {
      const newPlans = plans.map(p =>
        p.id === id ? { ...p, completed: false } : p
      )
      setPlans(newPlans)
      localStorage.setItem('plans', JSON.stringify(newPlans))
      return
    }

    // Mark as completed
    const newPlans = plans.map(p =>
      p.id === id ? { ...p, completed: true } : p
    )
    setPlans(newPlans)
    localStorage.setItem('plans', JSON.stringify(newPlans))

    // Create achievement
    const achievement: Achievement = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      content: plan.content,
      createdAt: new Date().toISOString()
    }
    
    // Add achievement to storage
    const savedAchievements = localStorage.getItem('achievements')
    const achievements = savedAchievements ? JSON.parse(savedAchievements) : []
    achievements.push(achievement)
    localStorage.setItem('achievements', JSON.stringify(achievements))

    // Visual feedback
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    toast.success('计划完成！已添加到今日成就', {
      description: plan.content,
      duration: 3000
    })
  }

  const handleEditPlan = (id: string, newContent: string) => {
    const newPlans = plans.map(plan =>
      plan.id === id ? { ...plan, content: newContent } : plan
    )
    setPlans(newPlans)
    localStorage.setItem('plans', JSON.stringify(newPlans))
  }

  // Group plans by date
  const groupedPlans = plans.reduce((groups, plan) => {
    if (!groups[plan.date]) {
      groups[plan.date] = []
    }
    groups[plan.date].push(plan)
    return groups
  }, {} as Record<string, Plan[]>)

  // Sort dates
  const sortedDates = Object.keys(groupedPlans).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  const today = new Date().toISOString().split('T')[0]
  const hasOverduePlans = sortedDates.some(date => date < today)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">明日计划</h1>
        <p className="text-gray-600">规划你的未来，一步一个脚印！</p>
      </motion.div>

      <PlanForm onSubmit={handleAddPlan} />

      {hasOverduePlans && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
        >
          <h3 className="text-yellow-800 font-medium mb-1">有未完成的计划</h3>
          <p className="text-yellow-600 text-sm">
            建议先处理过期的计划，可以选择完成或删除它们
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {sortedDates.map(date => {
          const plans = groupedPlans[date]
          const isOverdue = date < today
          const isToday = date === today

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 ${isOverdue ? 'opacity-75' : ''}`}
            >
              <h2 className={`
                text-lg font-semibold mb-4 flex items-center gap-2
                ${isOverdue ? 'text-yellow-600' : 'text-gray-800'}
                ${isToday ? 'text-green-600' : ''}
              `}>
                {new Date(date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
                {isOverdue && <span className="text-sm font-normal text-yellow-600">(已过期)</span>}
                {isToday && <span className="text-sm font-normal text-green-600">(今天)</span>}
              </h2>

              <PlanList
                plans={plans}
                onDelete={handleDeletePlan}
                onToggle={handleTogglePlan}
                onEdit={handleEditPlan}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
