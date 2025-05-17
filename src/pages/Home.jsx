import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import { getIcon } from '../utils/iconUtils'
import { fetchTasks } from '../services/taskService'
import { AuthContext } from '../App'

function Home() {
  // Get auth context
  const { isAuthenticated } = useContext(AuthContext);
  
  // Set up icons
  const ClipboardListIcon = getIcon('ClipboardList')
  const CheckCircleIcon = getIcon('CheckCircle')
  const ClockIcon = getIcon('Clock')
  
  // State for metrics
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    completed: 0,
    pending: 0
  })

  // Calculate metrics based on tasks
  const calculateMetrics = (tasks) => {
    const completed = tasks.filter(task => task.status === 'completed').length
    setMetrics({
      total: tasks.length,
      completed: completed,
      pending: tasks.length - completed
    })
  };

  // Function to handle task changes from MainFeature component
  const handleTasksChange = (updatedTasks) => {
    calculateMetrics(updatedTasks);
  };

  // Load initial metrics
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks().then(tasks => calculateMetrics(tasks)).catch(error => {
        console.error('Error fetching initial metrics:', error);
      });
    }
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
      <section className="mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-surface-900 dark:text-white">
              Task Dashboard
            </h1>
            <p className="text-surface-600 dark:text-surface-400 text-base md:text-lg">
              Organize your tasks efficiently and boost your productivity
            </p>
          </div>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            className="card border border-surface-200 dark:border-surface-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm md:text-base font-medium">Total Tasks</p>
                <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">{metrics.total}</h3>
              </div>
              <div className="bg-blue-200 dark:bg-blue-500/30 p-3 rounded-lg">
                <ClipboardListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card border border-surface-200 dark:border-surface-700 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm md:text-base font-medium">Completed</p>
                <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">{metrics.completed}</h3>
              </div>
              <div className="bg-green-200 dark:bg-green-500/30 p-3 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card border border-surface-200 dark:border-surface-700 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm md:text-base font-medium">Pending</p>
                <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">{metrics.pending}</h3>
              </div>
              <div className="bg-amber-200 dark:bg-amber-500/30 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Task Management Feature */}
      <section>
        <MainFeature onTasksChange={handleTasksChange} />
      </section>
    </div>
  )
}

export default Home