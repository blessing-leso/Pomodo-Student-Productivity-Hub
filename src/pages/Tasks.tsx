
import React from 'react';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Tasks: React.FC = () => {
  const [refresh, setRefresh] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("tasks");
  
  const handleTaskAdded = () => {
    setRefresh(prev => prev + 1);
    // Switch back to tasks tab after adding a task
    setActiveTab("tasks");
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold mb-4">Task Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="add">Add New Task</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
            <TaskList key={refresh} />
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <div className="mb-6 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <TaskForm onSuccess={handleTaskAdded} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
