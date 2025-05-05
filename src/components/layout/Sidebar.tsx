import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart as FlowChart, FileText, CheckSquare, Users, BarChart, Code, Settings, HelpCircle, LogOut, Activity } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { logout } = useApp();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    console.log('Logout button clicked');
    await logout();
    console.log('Logout function completed');
    navigate('/login');
  };
  
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-shrink-0 items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">FlowForge</span>
        </div>
      </div>
      
      <nav className="mt-5 flex-1 space-y-1 px-3">
        <NavItem to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
        <NavItem to="/workflows" icon={<FlowChart className="h-5 w-5" />} label="Workflows" />
        <NavItem to="/forms" icon={<FileText className="h-5 w-5" />} label="Forms" />
        <NavItem to="/tasks" icon={<CheckSquare className="h-5 w-5" />} label="Tasks" />
        <NavItem to="/users" icon={<Users className="h-5 w-5" />} label="Users & Teams" />
        <NavItem to="/reports" icon={<BarChart className="h-5 w-5" />} label="Reports" />
        <NavItem to="/integrations" icon={<Code className="h-5 w-5" />} label="Integrations" />
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
          <NavItem to="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" />
        </div>
      </nav>
      
      <div className="flex-shrink-0 p-3 border-t border-gray-200">
        <LogoutButton onClick={handleLogout} icon={<LogOut className="h-5 w-5" />} label="Logout" />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-primary-50 text-primary-600'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

interface LogoutButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

export default Sidebar;
