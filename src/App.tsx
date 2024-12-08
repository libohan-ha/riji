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
            <MainLayout>
              <Routes>
                <Route path="/" element={<AchievementsView />} />
                <Route path="/plans" element={<PlansView />} />
                <Route path="/ideas" element={<IdeasView />} />
                <Route path="/todos" element={<TodosView />} />
                <Route path="/failures" element={<FailuresView />} />
                <Route path="/folder/:folderName" element={<CustomFolderView />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </div>
        </Router>
      </FolderProvider>
    </SidebarProvider>
  )
}

export default App
