import { motion } from 'framer-motion'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 min-h-screen overflow-y-auto py-8 px-4 sm:px-8 pt-20 lg:pt-8"
    >
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </motion.main>
  )
}
