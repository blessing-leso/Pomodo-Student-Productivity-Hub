
import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../../types/task';
import { getUserTasks } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaskList: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchTasks = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const fetchedTasks = await getUserTasks(currentUser.uid);
      setTasks(fetchedTasks);
      setError('');
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">
            All ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({tasks.filter(t => !t.completed).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({tasks.filter(t => t.completed).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks available</p>
            </div>
          ) : (
            <>
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No active tasks</p>
            </div>
          ) : (
            <>
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No completed tasks</p>
            </div>
          ) : (
            <>
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
