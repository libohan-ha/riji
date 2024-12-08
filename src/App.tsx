import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { Sidebar } from './components/Sidebar'
import { MainLayout } from './components/MainLayout'
import { AchievementsView } from './views/AchievementsView'
import { PlansView } from './views/PlansView'
import { IdeasView } from './views/IdeasView'
import { TodosView } from './views/TodosView'
import { FailuresView } from './views/FailuresView'
import { CustomFolderView } from './views/CustomFolderView'
import { EditView } from './views/EditView'
import { NotFoundPage } from './views/NotFoundPage'
import { Toaster } from 'sonner'
import { SidebarProvider } from './contexts/SidebarContext'
import { FolderProvider } from './contexts/FolderContext'

function App() {
  return (
    <SidebarProvider>
      <FolderProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex">
            <Toaster position="top-right" />
            <Sidebar />
            <Routes>
              <Route path="/" element={<MainLayout><AchievementsView /></MainLayout>} />
              <Route path="/plans" element={<MainLayout><PlansView /></MainLayout>} />
              <Route path="/ideas" element={<MainLayout><IdeasView /></MainLayout>} />
              <Route path="/todos" element={<MainLayout><TodosView /></MainLayout>} />
              <Route path="/failures" element={<MainLayout><FailuresView /></MainLayout>} />
              <Route path="/folder/:folderName" element={<MainLayout><CustomFolderView /></MainLayout>} />
              <Route path="/:type/:id/edit" element={<EditView />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </FolderProvider>
    </SidebarProvider>
  )
}

export default App
