import { useState, useEffect } from 'react'
import { Failure } from '../types'
import { FailureForm } from '../components/FailureForm'
import { FailureList } from '../components/FailureList'
import { motion } from 'framer-motion'

export function FailuresView() {
  const [failures, setFailures] = useState<Failure[]>([])

  useEffect(() => {
    const savedFailures = localStorage.getItem('failures')
    if (savedFailures) {
      setFailures(JSON.parse(savedFailures))
    }
  }, [])

  const handleAddFailure = (failure: Failure) => {
    const newFailures = [...failures, failure]
    setFailures(newFailures)
    localStorage.setItem('failures', JSON.stringify(newFailures))
  }

  const handleDeleteFailure = (id: string) => {
    const newFailures = failures.filter(failure => failure.id !== id)
    setFailures(newFailures)
    localStorage.setItem('failures', JSON.stringify(newFailures))
  }

  const handleEditFailure = (id: string, newContent: string, newLesson?: string) => {
    const newFailures = failures.map(failure =>
      failure.id === id
        ? { ...failure, content: newContent, lesson: newLesson }
        : failure
    )
    setFailures(newFailures)
    localStorage.setItem('failures', JSON.stringify(newFailures))
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">失败日记</h1>
        <p className="text-gray-600">
          记录失败，总结教训，化挫折为成长的动力
        </p>
      </motion.div>

      <FailureForm onSubmit={handleAddFailure} />
      <FailureList 
        failures={failures}
        onDelete={handleDeleteFailure}
        onEdit={handleEditFailure}
      />
    </div>
  )
}
