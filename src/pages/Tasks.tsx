import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckSquare
} from 'lucide-react';

const Tasks: React.FC = () => {
  const { tasks, workflows, users, updateTask, deleteTask } = useApp();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    assignedTo: '',
    dueDate: '',
    workflowId: ''
  });
  
  // Filter tasks by search term, status, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    try {
      const result = {
        ...newTask,
        id: '',
        createdAt: '',
        updatedAt: ''
      };
      updateTask('', result);
      setShowAddTask(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        workflowId: ''
      });
      addToast('Task added successfully', 'success');
    } catch (error) {
      addToast('Failed to add task', 'error');
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const success = deleteTask(id);
      if (success) {
        addToast('Task deleted successfully', 'success');
      } else {
        addToast('Failed to delete task', 'error');
      }
    }
  };
  
  const handleStatusChange = (id: string, status: 'todo' | 'in_progress' | 'completed') => {
    const updatedTask = updateTask(id, { status });
    if (updatedTask) {
      addToast('Task status updated successfully', 'success');
    } else {
      addToast('Failed to update task status', 'error');
    }
  };
  
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'todo':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if due date is today
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if due date is tomorrow
    if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Otherwise, return formatted date
    return dueDate.toLocaleDateString();
  };
  
  const isOverdue = (dateString: string, status: string) => {
    if (status === 'completed') return false;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    
    return dueDate < today;
  };
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Manage and track tasks across your workflows</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddTask(true)}
        >
          <Plus className="h-5 w-5" />
          Add Task
        </button>
      </header>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="form-select"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTasks.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => {
                const assignee = users.find(user => user.id === task.assignedTo);
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                      {task.workflowId && (
                        <div className="text-xs text-primary-600 mt-1">
                          {workflows.find(w => w.id === task.workflowId)?.name || 'Unknown workflow'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span className="ml-1 text-sm">
                          {task.status === 'todo' ? 'To Do' : 
                           task.status === 'in_progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          {assignee?.name.charAt(0) || '?'}
                        </div>
                        <div className="ml-2 text-sm text-gray-900">{assignee?.name || 'Unassigned'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isOverdue(task.dueDate, task.status) ? 'text-error-600 font-medium' : 'text-gray-900'}`}>
                        {formatDueDate(task.dueDate)}
                        {isOverdue(task.dueDate, task.status) && (
                          <span className="ml-1 text-xs font-medium text-error-600">(Overdue)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {task.status !== 'completed' ? (
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className="text-success-600 hover:text-success-800"
                            title="Mark as completed"
                          >
                            <CheckSquare className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(task.id, 'todo')}
                            className="text-gray-600 hover:text-gray-800"
                            title="Reopen task"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        )}
                        
                        <button
                          className="text-primary-600 hover:text-primary-800"
                          title="Edit task"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-error-600 hover:text-error-800"
                          title="Delete task"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found. Create a new one!</p>
          </div>
        )}
      </div>
      
      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddTask(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="form-label" htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="form-control">
                <label className="form-label" htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  className="form-textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="form-control">
                <label className="form-label" htmlFor="task-assignee">Assign to</label>
                <select
                  id="task-assignee"
                  className="form-select"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                >
                  <option value="">Select assignee</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="form-label" htmlFor="task-due-date">Due Date</label>
                <input
                  id="task-due-date"
                  type="date"
                  className="form-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="form-label" htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ 
                      ...prev, 
                      priority: e.target.value as 'high' | 'medium' | 'low' 
                    }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="form-label" htmlFor="task-status">Status</label>
                  <select
                    id="task-status"
                    className="form-select"
                    value={newTask.status}
                    onChange={(e) => setNewTask(prev => ({ 
                      ...prev, 
                      status: e.target.value as 'todo' | 'in_progress' | 'completed' 
                    }))}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="form-control">
                <label className="form-label" htmlFor="task-workflow">Workflow (Optional)</label>
                <select
                  id="task-workflow"
                  className="form-select"
                  value={newTask.workflowId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, workflowId: e.target.value }))}
                >
                  <option value="">None</option>
                  {workflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button 
                className="btn btn-outline"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;