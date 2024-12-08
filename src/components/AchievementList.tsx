import { Trophy, Trash2, Heart, Star, Flame, ThumbsUp } from 'lucide-react'
import { Achievement } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface AchievementListProps {
  achievements: Achievement[]
  onDelete: (id: string) => void
  onEdit?: (id: string, newContent: string) => void
}

const reactions = [
  { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: ThumbsUp, color: 'text-blue-500', bg: 'bg-blue-50' },
]

export function AchievementList({ achievements, onDelete, onEdit }: AchievementListProps) {
  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const [selectedReactions, setSelectedReactions] = useState<Record<string, number>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const streak = calculateStreak(achievements)

  const groupedAchievements = sortedAchievements.reduce((groups, achievement) => {
    const date = achievement.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(achievement)
    return groups
  }, {} as Record<string, Achievement[]>)

  if (achievements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center my-16 space-y-4"
      >
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-gray-700">开始记录你的第一个成就吧！</h3>
        <p className="text-gray-500">每一个小进步都值得被记录和庆祝</p>
      </motion.div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date)
  }

  const handleReaction = (achievementId: string, reactionIndex: number) => {
    setSelectedReactions(prev => ({
      ...prev,
      [achievementId]: reactionIndex
    }))
  }

  const startEditing = (achievement: Achievement) => {
    setEditingId(achievement.id)
    setEditContent(achievement.content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      finishEditing()
    }
    if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  const finishEditing = () => {
    if (editingId && editContent.trim() && onEdit) {
      onEdit(editingId, editContent.trim())
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {streak > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="achievement-streak p-6 rounded-2xl shadow-lg mb-6 text-white"
        >
          <div className="flex items-center gap-3">
            <Flame className="animate-bounce" size={24} />
            <span className="text-xl font-bold">太棒了！已经连续打卡 {streak} 天</span>
          </div>
          <p className="mt-2 text-white/80">继续保持，你正在创造最好的自己！</p>
        </motion.div>
      )}

      {Object.entries(groupedAchievements).map(([date, dailyAchievements]) => (
        <div key={date} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 pl-2">
            {formatDate(date)}
          </h2>
          <AnimatePresence>
            {dailyAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                whileHover={{ scale: 1.02 }}
                className="gradient-card rounded-2xl p-6 shadow-sm group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-2 rounded-xl">
                    <Trophy className="text-yellow-500" size={24} />
                  </div>
                  <div className="flex-1">
                    {editingId === achievement.id ? (
                      <TextareaAutosize
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onBlur={finishEditing}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full text-gray-800 text-lg bg-white/50 rounded-lg p-2 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 border border-gray-200 resize-none"
                        minRows={1}
                      />
                    ) : (
                      <p 
                        className="text-gray-800 text-lg cursor-pointer hover:bg-white/50 rounded-lg p-2 transition-colors"
                        onClick={() => startEditing(achievement)}
                      >
                        {achievement.content}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      {reactions.map((Reaction, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReaction(achievement.id, index)}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            selectedReactions[achievement.id] === index 
                              ? `${reactions[index].bg} ${reactions[index].color} scale-110` 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <Reaction.icon size={20} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(achievement.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function calculateStreak(achievements: Achievement[]): number {
  if (achievements.length === 0) return 0;

  const dates = achievements.map(a => new Date(a.date).toISOString().split('T')[0]);
  const uniqueDates = [...new Set(dates)].sort();
  
  let streak = 1;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
    return 0;
  }

  for (let i = uniqueDates.length - 1; i > 0; i--) {
    const current = new Date(uniqueDates[i]);
    const previous = new Date(uniqueDates[i - 1]);
    const diffDays = (current.getTime() - previous.getTime()) / (1000 * 3600 * 24);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
