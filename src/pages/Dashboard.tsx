
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTasks } from '../services/taskService';
import { Task } from '../types/task';
import TaskStatistics from '../components/analytics/TaskStatistics';
import TaskProgressChart from '../components/analytics/TaskProgressChart';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const fetchedTasks = await getUserTasks(currentUser.uid);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  // Calculate task summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your productivity and manage tasks</p>
        </div>
        <Link to="/tasks">
          <Button className="mt-4 md:mt-0" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow p-4 transition-all hover:shadow-md">
                  <div className="text-gray-500 text-sm mb-1">Total Tasks</div>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-green-50 rounded-lg shadow p-4 transition-all hover:shadow-md">
                  <div className="text-gray-500 text-sm mb-1">Completed</div>
                  <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-yellow-50 rounded-lg shadow p-4 transition-all hover:shadow-md">
                  <div className="text-gray-500 text-sm mb-1">Pending</div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-red-50 rounded-lg shadow p-4 transition-all hover:shadow-md">
                  <div className="text-gray-500 text-sm mb-1">High Priority</div>
                  <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
                </div>
              </div>

              <TaskStatistics tasks={tasks} />
            </>
          )}
        </div>
        <div className="col-span-1">
          <TaskProgressChart tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
