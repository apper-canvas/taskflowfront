/**
 * Service for handling task-related operations with the Apper backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Fetch all tasks for the current user
 * @param {string} filter - Optional filter for task status
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort direction (asc/desc)
 * @returns {Promise<Array>} - Array of task objects
 */
export const fetchTasks = async (filter = 'all', sortBy = 'createdAt', sortOrder = 'desc') => {
  try {
    const apperClient = getApperClient();
    
    // Define fields to fetch
    const fields = [
      'Id', 'title', 'description', 'priority', 'status', 'dueDate',
      'CreatedOn', 'CreatedBy', 'ModifiedOn'
    ];
    
    // Build where condition for filter
    let whereConditions = [];
    if (filter !== 'all') {
      whereConditions.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [filter]
      });
    }
    
    // Add condition to only show non-deleted tasks
    whereConditions.push({
      fieldName: 'IsDeleted',
      operator: 'ExactMatch',
      values: [false]
    });
    
    // Define sort order
    const orderByParams = [];
    if (sortBy === 'priority') {
      orderByParams.push({
        field: 'priority',
        direction: sortOrder
      });
    } else if (sortBy === 'dueDate') {
      orderByParams.push({
        field: 'dueDate',
        direction: sortOrder
      });
    } else {
      // Default sort by createdAt (CreatedOn in the database)
      orderByParams.push({
        field: 'CreatedOn',
        direction: sortOrder
      });
    }
    
    const response = await apperClient.fetchRecords('task', {
      fields,
      where: whereConditions,
      orderBy: orderByParams
    });
    
    if (!response || !response.data) {
      return [];
    }
    
    // Transform the response to match our frontend model
    return response.data.map(task => ({
      id: task.Id.toString(),
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.dueDate || '',
      createdAt: task.CreatedOn || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data to create
 * @returns {Promise<Object>} - Created task object
 */
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare only updateable fields
    const taskRecord = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate
    };
    
    const response = await apperClient.createRecord('task', {
      records: [taskRecord]
    });
    
    if (!response || !response.results || !response.results[0].success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to create task');
    }
    
    // Return the created task with our frontend model
    const createdTask = response.results[0].data;
    return {
      id: createdTask.Id.toString(),
      title: createdTask.title || '',
      description: createdTask.description || '',
      priority: createdTask.priority || 'medium',
      status: createdTask.status || 'pending',
      dueDate: createdTask.dueDate || '',
      createdAt: createdTask.CreatedOn || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {Object} taskData - Task data to update (must include id)
 * @returns {Promise<Object>} - Updated task object
 */
export const updateTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare only updateable fields plus Id for update
    const taskRecord = {
      Id: parseInt(taskData.id),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate
    };
    
    const response = await apperClient.updateRecord('task', {
      records: [taskRecord]
    });
    
    if (!response || !response.results || !response.results[0].success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to update task');
    }
    
    // Return the updated task with our frontend model
    const updatedTask = response.results[0].data;
    return {
      id: updatedTask.Id.toString(),
      title: updatedTask.title || '',
      description: updatedTask.description || '',
      priority: updatedTask.priority || 'medium',
      status: updatedTask.status || 'pending',
      dueDate: updatedTask.dueDate || '',
      createdAt: updatedTask.CreatedOn || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - ID of task to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    const response = await apperClient.deleteRecord('task', {
      RecordIds: [parseInt(taskId)]
    });
    
    if (!response || !response.results || !response.results[0].success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to delete task');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};