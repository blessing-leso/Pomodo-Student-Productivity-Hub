
import React, { useState } from 'react';
import { Task } from '../../types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, isWithinInterval, startOfDay } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskProgressChartProps {
  tasks: Task[];
}

const TaskProgressChart: React.FC<TaskProgressChartProps> = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState('week');

  const getTimeRangeData = () => {
    const today = new Date();
    let daysToShow: number;
    
    switch (timeRange) {
      case 'week':
        daysToShow = 7;
        break;
      case 'month':
        daysToShow = 30;
        break;
      case 'year':
        daysToShow = 365;
        break;
      default:
        daysToShow = 7;
    }
    
    const startDate = subDays(today, daysToShow);
    
    // Filter tasks within the selected time range
    const tasksInRange = tasks.filter(task => {
      return isWithinInterval(task.createdAt, {
        start: startDate,
        end: today
      });
    });
    
    // For week and month, show daily data
    if (timeRange === 'week' || timeRange === 'month') {
      const data = [];
      
      for (let i = 0; i < daysToShow; i++) {
        const date = subDays(today, i);
        const dateString = format(date, 'MMM dd');
        
        const dayStart = startOfDay(date);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);
        
        const tasksCreated = tasksInRange.filter(task => {
          const taskDate = task.createdAt;
          return isWithinInterval(taskDate, { start: dayStart, end: dayEnd });
        }).length;
        
        const tasksCompleted = tasksInRange.filter(task => {
          const taskDate = task.createdAt;
          return task.completed && isWithinInterval(taskDate, { start: dayStart, end: dayEnd });
        }).length;
        
        data.unshift({ date: dateString, created: tasksCreated, completed: tasksCompleted });
      }
      
      return data;
    }
    
    // For yearly data, show monthly aggregates
    if (timeRange === 'year') {
      const monthData: Record<string, { created: number; completed: number }> = {};
      
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthString = format(date, 'MMM');
        monthData[monthString] = { created: 0, completed: 0 };
      }
      
      tasksInRange.forEach(task => {
        const monthString = format(task.createdAt, 'MMM');
        if (monthData[monthString]) {
          monthData[monthString].created += 1;
          if (task.completed) {
            monthData[monthString].completed += 1;
          }
        }
      });
      
      return Object.entries(monthData).map(([month, data]) => ({
        date: month,
        created: data.created,
        completed: data.completed
      })).reverse();
    }
    
    return [];
  };
  
  const chartData = getTimeRangeData();

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Task Progress over Time</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" name="Tasks Created" fill="#0097B2" />
                <Bar dataKey="completed" name="Tasks Completed" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No data available for the selected time range</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskProgressChart;
