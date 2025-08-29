
import React, { useState } from 'react';
import { Task } from '../../types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { toggleTaskCompletion, deleteTask } from '../../services/taskService';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TaskEditForm from './TaskEditForm';
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleCompletion = async () => {
    setIsUpdating(true);
    try {
      await toggleTaskCompletion(task.id, task.completed);
      onUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(false);
    try {
      await deleteTask(task.id);
      onUpdate();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <>
      <Card className={`mb-4 transition-all ${task.completed ? 'opacity-70' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleCompletion}
              disabled={isUpdating}
              id={`task-${task.id}`}
              className="h-5 w-5"
            />
            <CardTitle 
              className={`ml-2 text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {task.title}
            </CardTitle>
          </div>
          
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </CardHeader>
        
        {task.description && (
          <CardContent className="py-2">
            <p className={`text-gray-700 ${task.completed ? 'text-gray-400' : ''}`}>
              {task.description}
            </p>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-between pt-2">
          <div className="text-xs text-gray-500">
            {task.dueDate && (
              <span>
                Due: {format(task.dueDate, 'MMM d, yyyy')}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditModalOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setIsDeleting(true)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {isEditModalOpen && (
        <TaskEditForm 
          task={task} 
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
};

export default TaskItem;
