import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Download, 
  Filter, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Reports: React.FC = () => {
  const { tasks, workflows, users } = useApp();
  const [reportType, setReportType] = useState<string>('tasks');
  const [dateRange, setDateRange] = useState<string>('month');
  
  // Colors for charts
  const COLORS = ['#3B82F6', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  
  // Prepare data for tasks by status chart
  const tasksByStatus = [
    { name: 'To Do', value: tasks.filter(task => task.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'in_progress').length },
    { name: 'Completed', value: tasks.filter(task => task.status === 'completed').length },
  ];
  
  // Prepare data for tasks by priority chart
  const tasksByPriority = [
    { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(task => task.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(task => task.priority === 'low').length },
  ];
  
  // Prepare data for workflow usage chart
  const workflowUsage = workflows.map(workflow => ({
    name: workflow.name,
    tasks: tasks.filter(task => task.workflowId === workflow.id).length,
  }));
  
  // Prepare data for user activity chart
  const userActivity = users.map(user => ({
    name: user.name,
    assigned: tasks.filter(task => task.assignedTo === user.id).length,
    completed: tasks.filter(task => task.assignedTo === user.id && task.status === 'completed').length,
  }));
  
  // Generate mock data for task completion over time
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    const startDate = new Date();
    
    // Set start date based on date range
    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (dateRange === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    // Generate random data for each day in the range
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      data.push({
        date: new Date(currentDate).toLocaleDateString(),
        completed: Math.floor(Math.random() * 5), // Random value between 0 and 5
        created: Math.floor(Math.random() * 8), // Random value between 0 and 8
      });
      
      // Increment by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };
  
  const timeSeriesData = generateTimeSeriesData();
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Analyze workflow performance and team productivity</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <Download className="h-5 w-5" />
            Export
          </button>
          <button className="btn btn-outline">
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </header>
      
      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select
            className="form-select"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
          >
            <option value="tasks">Task Analytics</option>
            <option value="workflows">Workflow Performance</option>
            <option value="users">User Productivity</option>
            <option value="time">Time-based Analysis</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            className="form-select"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>
      
      {/* Reports Content */}
      <div className="space-y-6">
        {/* Task Analytics */}
        {reportType === 'tasks' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Status Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Tasks by Status</h2>
                  <span className="text-xs text-gray-500">Total: {tasks.length} tasks</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tasksByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {tasksByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Task Priority Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Tasks by Priority</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tasksByPriority}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Tasks" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Task Completion Trend */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Task Completion Trend</h2>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">Last {dateRange === 'week' ? '7 Days' : dateRange === 'month' ? '30 Days' : '12 Months'}</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      // Show fewer ticks for better readability
                      interval={Math.floor(timeSeriesData.length / 7)}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed Tasks"
                      stroke="#10B981"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      name="Created Tasks"
                      stroke="#3B82F6"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        
        {/* Workflow Performance */}
        {reportType === 'workflows' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Workflow Usage</h2>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workflowUsage}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tasks" name="Tasks" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflows.slice(0, 3).map(workflow => (
                <div key={workflow.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-lg mb-2">{workflow.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{workflow.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Active Tasks</span>
                        <span className="font-medium">
                          {tasks.filter(t => t.workflowId === workflow.id && t.status !== 'completed').length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completed Tasks</span>
                        <span className="font-medium">
                          {tasks.filter(t => t.workflowId === workflow.id && t.status === 'completed').length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{ width: '40%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Completion Time</span>
                        <span className="font-medium">2.5 days</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-warning-500 h-2 rounded-full"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* User Productivity */}
        {reportType === 'users' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">User Activity</h2>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="assigned" name="Assigned Tasks" fill="#3B82F6" />
                    <Bar dataKey="completed" name="Completed Tasks" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Assigned Tasks</span>
                        <span className="font-medium">
                          {tasks.filter(t => t.assignedTo === user.id).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(100, tasks.filter(t => t.assignedTo === user.id).length * 10)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span className="font-medium">
                          {tasks.filter(t => t.assignedTo === user.id).length === 0 
                            ? '0%' 
                            : `${Math.round((tasks.filter(t => t.assignedTo === user.id && t.status === 'completed').length / tasks.filter(t => t.assignedTo === user.id).length) * 100)}%`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{ 
                            width: tasks.filter(t => t.assignedTo === user.id).length === 0 
                              ? '0%' 
                              : `${Math.round((tasks.filter(t => t.assignedTo === user.id && t.status === 'completed').length / tasks.filter(t => t.assignedTo === user.id).length) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overdue Tasks</span>
                        <span className="font-medium">
                          {tasks.filter(t => 
                            t.assignedTo === user.id && 
                            t.status !== 'completed' && 
                            new Date(t.dueDate) < new Date()
                          ).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-error-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(100, tasks.filter(t => 
                              t.assignedTo === user.id && 
                              t.status !== 'completed' && 
                              new Date(t.dueDate) < new Date()
                            ).length * 20)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Time-based Analysis */}
        {reportType === 'time' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Task Activity Over Time</h2>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">Last {dateRange === 'week' ? '7 Days' : dateRange === 'month' ? '30 Days' : '12 Months'}</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={Math.floor(timeSeriesData.length / 7)}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed Tasks"
                      stroke="#10B981"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      name="Created Tasks"
                      stroke="#3B82F6"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Tasks Created vs Completed</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tasks Created</span>
                    <span className="font-semibold">{timeSeriesData.reduce((sum, item) => sum + item.created, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="font-semibold">{timeSeriesData.reduce((sum, item) => sum + item.completed, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {Math.round((timeSeriesData.reduce((sum, item) => sum + item.completed, 0) / timeSeriesData.reduce((sum, item) => sum + item.created, 0)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Average Time to Complete</h3>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-primary-600 mb-2">2.8</div>
                  <div className="text-gray-500 mb-4">days per task</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: '70%' }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">
                    5% improvement from previous period
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Peak Activity Times</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Morning (8AM - 12PM)</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: '42%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Afternoon (12PM - 5PM)</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: '35%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Evening (5PM - 8PM)</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: '23%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;