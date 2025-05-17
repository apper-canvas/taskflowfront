import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { getIcon } from '../utils/iconUtils'

function MainFeature({ onTasksChange }) {
  // Setting up icons
  const PlusIcon = getIcon('Plus')
  const XIcon = getIcon('X')
  const EditIcon = getIcon('Edit')
  const TrashIcon = getIcon('Trash2')
  const CheckIcon = getIcon('Check')
  const FilterIcon = getIcon('Filter')
  const SortIcon = getIcon('ArrowUpDown')
  const InfoIcon = getIcon('Info')

  // Define default task structure
  const defaultTask = {
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
    dueDate: ''
  }

  // State for tasks and form
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({...defaultTask})
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [detailsTaskId, setDetailsTaskId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
      setTasks(savedTasks)
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error)
      setTasks([])
    }
  }, [])

  // Update parent component when tasks change
  useEffect(() => {
    onTasksChange(tasks)
  }, [tasks, onTasksChange])

  // Filter and sort tasks
  const filteredAndSortedTasks = [...tasks]
    .filter(task => {
      if (filter === 'all') return true
      return task.status === filter
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return sortOrder === 'asc' 
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority]
        }
      }
      
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return sortOrder === 'asc' ? 1 : -1
        if (!b.dueDate) return sortOrder === 'asc' ? -1 : 1
        return sortOrder === 'asc' 
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate)
      }
      
      // Default sort by createdAt
      return sortOrder === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    })

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    if (isEditing) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === newTask.id ? newTask : task
      )
      setTasks(updatedTasks)
      toast.success("Task updated successfully")
    } else {
      // Add new task
      const taskToAdd = {
        ...newTask,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      setTasks(prev => [...prev, taskToAdd])
      toast.success("Task added successfully")
    }

    // Reset form
    setNewTask({...defaultTask})
    setIsFormVisible(false)
    setIsEditing(false)
  }

  // Toggle task status
  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        return { ...task, status: newStatus }
      }
      return task
    })
    
    setTasks(updatedTasks)
    
    const taskStatus = updatedTasks.find(t => t.id === id).status
    toast.info(`Task marked as ${taskStatus}`)
  }

  // Edit task
  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id)
    if (taskToEdit) {
      setNewTask(taskToEdit)
      setIsEditing(true)
      setIsFormVisible(true)
      setSelectedTaskId(id)
    }
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    setDetailsTaskId(null)
    toast.success("Task deleted successfully")
  }

  // Toggle form visibility
  const toggleForm = () => {
    if (isFormVisible && isEditing) {
      // If closing the edit form, reset it
      setNewTask({...defaultTask})
      setIsEditing(false)
    }
    setIsFormVisible(prev => !prev)
  }

  // Toggle task details
  const toggleTaskDetails = (id) => {
    setDetailsTaskId(detailsTaskId === id ? null : id)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Get priority style class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'task-priority-high'
      case 'medium': return 'task-priority-medium'
      case 'low': return 'task-priority-low'
      default: return 'task-priority-medium'
    }
  }

  // Get status style class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'task-status-pending'
      case 'in-progress': return 'task-status-in-progress'
      case 'completed': return 'task-status-completed'
      default: return 'task-status-pending'
    }
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white">Task Manager</h2>
          <p className="text-surface-500 dark:text-surface-400 text-sm md:text-base">Organize and track your tasks</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={toggleForm}
            className={`btn ${isFormVisible ? 'btn-outline' : 'btn-primary'} w-full sm:w-auto`}
          >
            {isFormVisible ? (
              <>
                <XIcon size={18} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusIcon size={18} />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="bg-surface-50 dark:bg-surface-800/70 p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center text-surface-700 dark:text-surface-300">
            <FilterIcon size={16} className="mr-1" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm px-3 py-1.5 pr-8 text-surface-700 dark:text-surface-300"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center text-surface-700 dark:text-surface-300">
            <SortIcon size={16} className="mr-1" />
            <span className="text-sm font-medium">Sort:</span>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm px-3 py-1.5 pr-8 text-surface-700 dark:text-surface-300"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg text-sm px-3 py-1.5 pr-8 text-surface-700 dark:text-surface-300"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field"
                    placeholder="Enter task description"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newTask.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={toggleForm}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    {isEditing ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="divide-y divide-surface-200 dark:divide-surface-700 max-h-[600px] overflow-auto">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map(task => (
            <div 
              key={task.id} 
              className={`p-4 transition-colors ${selectedTaskId === task.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
                    task.status === 'completed' 
                      ? 'bg-green-500 border-green-500 flex items-center justify-center' 
                      : 'border-surface-400 dark:border-surface-600'
                  }`}
                  aria-label={task.status === 'completed' ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.status === 'completed' && <CheckIcon size={12} className="text-white" />}
                </button>
                
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 
                      className={`text-lg font-medium ${
                        task.status === 'completed' 
                          ? 'text-surface-500 dark:text-surface-400 line-through' 
                          : 'text-surface-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={getPriorityClass(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                      
                      <span className={getStatusClass(task.status)}>
                        {task.status === 'in-progress' ? 'In Progress' : 
                          task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>

                      {task.dueDate && (
                        <span className="text-xs text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded-full">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Task Actions */}
                  <div className="mt-2 flex justify-between items-center">
                    <button 
                      onClick={() => toggleTaskDetails(task.id)}
                      className="text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300 flex items-center gap-1"
                    >
                      <InfoIcon size={14} />
                      {detailsTaskId === task.id ? 'Hide Details' : 'Show Details'}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => editTask(task.id)}
                        className="p-1.5 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                        aria-label="Edit task"
                      >
                        <EditIcon size={16} />
                      </button>
                      
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        aria-label="Delete task"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Task Details */}
                  <AnimatePresence>
                    {detailsTaskId === task.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                          <div className="text-sm text-surface-600 dark:text-surface-400">
                            {task.description ? (
                              <p className="mb-2">{task.description}</p>
                            ) : (
                              <p className="italic text-surface-500 dark:text-surface-500 mb-2">No description provided</p>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-medium text-surface-700 dark:text-surface-300">Created:</span> {formatDate(task.createdAt)}
                              </div>
                              
                              <div>
                                <span className="font-medium text-surface-700 dark:text-surface-300">Due Date:</span> {formatDate(task.dueDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="bg-surface-100 dark:bg-surface-800 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
              <ClipboardListIcon className="w-8 h-8 text-surface-400 dark:text-surface-500" />
            </div>
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              {filter === 'all' 
                ? "You don't have any tasks yet. Click 'Add Task' to create your first task."
                : `You don't have any ${filter} tasks. Try changing the filter or adding new tasks.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainFeature