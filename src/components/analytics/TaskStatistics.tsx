
import React from 'react';
import { Task } from '../../types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TaskStatisticsProps {
  tasks: Task[];
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ tasks }) => {
  // Calculate task completion rate
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Data for completion pie chart with updated color scheme
  const completionData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' }, // Green - same as low priority
    { name: 'Pending', value: totalTasks - completedTasks, color: '#F59E0B' } // Yellow - same as medium priority
  ];

  // Calculate task breakdown by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;

  // Data for priority pie chart
  const priorityData = [
    { name: 'High', value: highPriorityTasks, color: '#EF4444' },
    { name: 'Medium', value: mediumPriorityTasks, color: '#F59E0B' },
    { name: 'Low', value: lowPriorityTasks, color: '#10B981' }
  ];

  // Only display non-zero values
  const filteredPriorityData = priorityData.filter(item => item.value > 0);

  // Custom tooltip for the priority chart
  const PriorityTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const priorityType = payload[0].name;
      const tasksOfPriority = tasks.filter(task => task.priority.toLowerCase() === priorityType.toLowerCase());
      
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-bold">{priorityType} Priority ({payload[0].value})</p>
          <ul className="text-xs mt-1 max-h-32 overflow-y-auto">
            {tasksOfPriority.map((task, index) => (
              <li key={index} className="truncate max-w-48">• {task.title}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the completion chart
  const CompletionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const status = payload[0].name;
      const tasksWithStatus = tasks.filter(task => 
        (status === 'Completed' && task.completed) || 
        (status === 'Pending' && !task.completed)
      );
      
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-bold">{status} Tasks ({payload[0].value})</p>
          <ul className="text-xs mt-1 max-h-32 overflow-y-auto">
            {tasksWithStatus.map((task, index) => (
              <li key={index} className="truncate max-w-48">• {task.title}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">Task Completion Rate</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold">
              {completionRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-[200px]">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip content={<CompletionTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No tasks available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-amber-50">
        <CardHeader>
          <CardTitle className="text-lg">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[200px]">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredPriorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredPriorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip content={<PriorityTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No tasks available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStatistics;
