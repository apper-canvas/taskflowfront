import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { getIcon } from './utils/iconUtils'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { format } from 'date-fns'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check for user's color scheme preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDark)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Setup icon components
  const SunIcon = getIcon('Sun')
  const MoonIcon = getIcon('Moon')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 py-3 md:py-4 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gradient-to-r from-primary to-secondary p-1.5 md:p-2 rounded-lg">
              <div className="text-white font-bold text-sm md:text-base">TF</div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white">TaskFlow</h1>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-3 md:py-4 px-4 md:px-6">
        <div className="container mx-auto text-center text-surface-500 dark:text-surface-400 text-sm">
          <p>© {format(new Date(), 'yyyy')} TaskFlow. All rights reserved.</p>
        </div>
      </footer>

      {/* Toast container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  )
}

export default App