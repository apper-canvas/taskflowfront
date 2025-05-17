import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

function NotFound() {
  const ArrowLeftIcon = getIcon('ArrowLeft') 
  const FileQuestionIcon = getIcon('FileQuestion')

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6 flex justify-center">
          <div className="bg-surface-100 dark:bg-surface-800 rounded-full p-6">
            <FileQuestionIcon className="w-16 h-16 text-surface-400 dark:text-surface-500" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-surface-900 dark:text-white">
          404 - Page Not Found
        </h1>
        
        <p className="text-surface-600 dark:text-surface-400 text-lg md:text-xl max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound