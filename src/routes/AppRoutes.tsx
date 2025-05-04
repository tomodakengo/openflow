import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Dashboard from '../pages/Dashboard';
import Workflows from '../pages/Workflows';
import WorkflowBuilder from '../pages/WorkflowBuilder';
import Forms from '../pages/Forms';
import FormBuilder from '../pages/FormBuilder';
import Tasks from '../pages/Tasks';
import Reports from '../pages/Reports';
import Users from '../pages/Users';
import Integrations from '../pages/Integrations';
import Settings from '../pages/Settings';
import Help from '../pages/Help';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/workflows"
        element={isAuthenticated ? <Workflows /> : <Navigate to="/login" />}
      />
      <Route
        path="/workflows/new"
        element={isAuthenticated ? <WorkflowBuilder /> : <Navigate to="/login" />}
      />
      <Route
        path="/workflows/:id"
        element={isAuthenticated ? <WorkflowBuilder /> : <Navigate to="/login" />}
      />
      <Route
        path="/forms"
        element={isAuthenticated ? <Forms /> : <Navigate to="/login" />}
      />
      <Route
        path="/forms/new"
        element={isAuthenticated ? <FormBuilder /> : <Navigate to="/login" />}
      />
      <Route
        path="/forms/:id"
        element={isAuthenticated ? <FormBuilder /> : <Navigate to="/login" />}
      />
      <Route
        path="/tasks"
        element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />}
      />
      <Route
        path="/reports"
        element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
      />
      <Route
        path="/users"
        element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
      />
      <Route
        path="/integrations"
        element={isAuthenticated ? <Integrations /> : <Navigate to="/login" />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
      />
      <Route
        path="/help"
        element={isAuthenticated ? <Help /> : <Navigate to="/login" />}
      />
      
      {/* Default route */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;