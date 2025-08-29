
import { Task, TaskPriority } from '../types/task';

// Mock database as a simple in-memory array
const mockTasks: Task[] = [];

export const createTask = async (
  userId: string,
  title: string,
  description: string = '',
  priority: TaskPriority = 'medium',
  dueDate?: Date
): Promise<string> => {
  try {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate,
      priority,
      userId,
    };

    mockTasks.unshift(newTask); // Add to beginning for chronological order
    return newTask.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTasks.filter(task => task.userId === userId);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  try {
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = {
        ...mockTasks[taskIndex],
        ...updates
      };
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const toggleTaskCompletion = async (
  taskId: string, 
  currentStatus: boolean
): Promise<void> => {
  try {
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].completed = !currentStatus;
    }
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};
