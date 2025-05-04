import React from "react";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  ThumbsUp,
  ArrowRight,
  FileText,
} from "lucide-react";
import { mockDashboardStats } from "../data/mockData";
import { useApp } from "../contexts/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard: React.FC = () => {
  const { currentUser, tasks } = useApp();
  const {
    activeWorkflows,
    totalTasks,
    completedTasks,
    pendingApprovals,
    tasksByPriority,
    tasksByStatus,
    recentWorkflows,
  } = mockDashboardStats;

  // Colors for charts
  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

  const priorityData = [
    {
      name: "High",
      value: tasksByPriority.find((t) => t.priority === "high")?.count || 0,
    },
    {
      name: "Medium",
      value: tasksByPriority.find((t) => t.priority === "medium")?.count || 0,
    },
    {
      name: "Low",
      value: tasksByPriority.find((t) => t.priority === "low")?.count || 0,
    },
  ];

  const statusData = [
    {
      name: "To Do",
      value: tasksByStatus.find((t) => t.status === "todo")?.count || 0,
    },
    {
      name: "In Progress",
      value: tasksByStatus.find((t) => t.status === "in_progress")?.count || 0,
    },
    {
      name: "Completed",
      value: tasksByStatus.find((t) => t.status === "completed")?.count || 0,
    },
  ];

  // Get assigned tasks for the current user
  const myTasks = tasks.filter((task) => task.assignedTo === currentUser?.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {currentUser?.name || "User"}
        </p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Workflows"
          value={activeWorkflows}
          icon={<TrendingUp className="h-6 w-6 text-primary-500" />}
          bgColor="bg-primary-50"
        />
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={<FileText className="h-6 w-6 text-secondary-500" />}
          bgColor="bg-secondary-50"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          icon={<CheckCircle className="h-6 w-6 text-success-500" />}
          bgColor="bg-success-50"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon={<ThumbsUp className="h-6 w-6 text-warning-500" />}
          bgColor="bg-warning-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tasks by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tasks by Priority</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tasks" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Items and My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Workflows</h2>
            <a
              href="/workflows"
              className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            {recentWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{workflow.name}</h3>
                  <p className="text-sm text-gray-500">
                    Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/workflows/${workflow.id}`}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <a
              href="/tasks"
              className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            {myTasks.length > 0 ? (
              myTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-3">
                    {task.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-success-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-warning-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      task.priority === "high"
                        ? "bg-error-100 text-error-800"
                        : ""
                    }
                    ${
                      task.priority === "medium"
                        ? "bg-warning-100 text-warning-800"
                        : ""
                    }
                    ${
                      task.priority === "low"
                        ? "bg-success-100 text-success-800"
                        : ""
                    }
                  `}
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No tasks assigned to you
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`rounded-full p-3 mr-4 ${bgColor}`}>{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
