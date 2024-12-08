import { useState, useEffect } from 'react'
import { Achievement } from '../types'
import { AchievementForm } from '../components/AchievementForm'
import { AchievementList } from '../components/AchievementList'
import { motion } from 'framer-motion'

export function AchievementsView() {
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements')
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  const handleAddAchievement = (achievement: Achievement) => {
    const newAchievements = [...achievements, achievement]
    setAchievements(newAchievements)
    localStorage.setItem('achievements', JSON.stringify(newAchievements))
  }

  const handleDeleteAchievement = (id: string) => {
    const newAchievements = achievements.filter(achievement => achievement.id !== id)
    setAchievements(newAchievements)
    localStorage.setItem('achievements', JSON.stringify(newAchievements))
  }

  const handleEditAchievement = (id: string, newContent: string) => {
    const newAchievements = achievements.map(achievement =>
      achievement.id === id
        ? { ...achievement, content: newContent }
        : achievement
    )
    setAchievements(newAchievements)
    localStorage.setItem('achievements', JSON.stringify(newAchievements))
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">今日成就</h1>
        <p className="text-gray-600">记录你今天的成功时刻！</p>
      </motion.div>

      <AchievementForm onSubmit={handleAddAchievement} />
      <AchievementList 
        achievements={achievements} 
        onDelete={handleDeleteAchievement}
        onEdit={handleEditAchievement}
      />
    </div>
  )
}
