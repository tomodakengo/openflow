import React, { useState } from 'react';
import { 
  Plus, 
  Link2, 
  Code, 
  ExternalLink, 
  CheckCircle, 
  XCircle,
  Settings,
  RefreshCw,
  Webhook,
  Database
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  type: 'api' | 'webhook' | 'database' | 'app';
  icon: React.ReactNode;
  lastSync?: string;
}

const Integrations: React.FC = () => {
  // Mock integrations for UI display
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Google Workspace',
      description: 'Sync calendar events and emails',
      status: 'connected',
      type: 'api',
      icon: <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>,
      lastSync: '2023-04-10T10:30:00Z'
    },
    {
      id: '2',
      name: 'Slack',
      description: 'Send notifications to channels',
      status: 'connected',
      type: 'webhook',
      icon: <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.687 8.834a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.166 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.166 17.687a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.312A2.527 2.527 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" fill="#E01E5A" />
            </svg>,
      lastSync: '2023-04-12T14:45:00Z'
    },
    {
      id: '3',
      name: 'Microsoft 365',
      description: 'Sync with SharePoint and Teams',
      status: 'disconnected',
      type: 'api',
      icon: <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.55 22.25a.78.78 0 0 1-.78-.78V9.33c0-.42.34-.77.78-.77h10.7c.42 0 .77.35.77.77v12.14c0 .43-.35.78-.77.78h-10.7z" fill="#FF5722" />
              <path d="M22.25 22.25h-10.7a.78.78 0 0 1-.78-.78V9.33c0-.42.34-.77.78-.77h10.7c.42 0 .77.35.77.77v12.14c0 .43-.35.78-.77.78z" fill="#4CAF50" />
              <path d="M11.55 10.68h11.47v10.79H11.55z" fill="#1E88E5" />
              <path d="M1.77 22.25A.78.78 0 0 1 1 21.47V2.53c0-.43.34-.78.77-.78H12.47c.43 0 .78.35.78.78v6.02h-1.7V3.3H2.55v17.24h8.99v1.71H1.77z" fill="#FF8A65" />
            </svg>
    },
    {
      id: '4',
      name: 'Stripe',
      description: 'Process payments and invoices',
      status: 'error',
      type: 'api',
      icon: <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="#6772E5" />
            </svg>,
      lastSync: '2023-04-11T09:15:00Z'
    },
    {
      id: '5',
      name: 'PostgreSQL',
      description: 'Connect to external database',
      status: 'connected',
      type: 'database',
      icon: <Database className="h-8 w-8 text-blue-700" />,
      lastSync: '2023-04-12T16:30:00Z'
    },
    {
      id: '6',
      name: 'Zapier',
      description: 'Automate workflows with other apps',
      status: 'disconnected',
      type: 'webhook',
      icon: <Webhook className="h-8 w-8 text-orange-500" />
    }
  ]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  
  // Filter integrations based on search and filters
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || integration.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === id) {
        const newStatus = integration.status === 'connected' ? 'disconnected' : 'connected';
        return {
          ...integration,
          status: newStatus,
          lastSync: newStatus === 'connected' ? new Date().toISOString() : integration.lastSync
        };
      }
      return integration;
    }));
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-success-100 text-success-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-500">Connect your workflows with other services</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddIntegration(true)}
        >
          <Plus className="h-5 w-5" />
          Add Integration
        </button>
      </header>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto flex space-x-2">
          <select
            className="form-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="api">API</option>
            <option value="webhook">Webhook</option>
            <option value="database">Database</option>
            <option value="app">Application</option>
          </select>
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="connected">Connected</option>
            <option value="disconnected">Disconnected</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>
      
      {/* Integrations Grid */}
      {filteredIntegrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map(integration => (
            <div key={integration.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {integration.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      <span className="ml-1">
                        {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                      </span>
                    </span>
                  </div>
                </div>
                
                {integration.lastSync && (
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Last synced: {new Date(integration.lastSync).toLocaleString()}
                  </div>
                )}
                
                <div className="mt-6 flex justify-between">
                  <button
                    className={`btn btn-sm ${
                      integration.status === 'connected' 
                        ? 'btn-error' 
                        : integration.status === 'error'
                        ? 'btn-warning'
                        : 'btn-primary'
                    }`}
                    onClick={() => toggleIntegrationStatus(integration.id)}
                  >
                    {integration.status === 'connected' ? 'Disconnect' : integration.status === 'error' ? 'Retry' : 'Connect'}
                  </button>
                  
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={integration.status !== 'connected'}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'No integrations match your search criteria.'
              : 'You haven\'t added any integrations yet.'}
          </p>
          {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' ? (
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowAddIntegration(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Integration
            </button>
          )}
        </div>
      )}
      
      {/* Add Integration Modal */}
      {showAddIntegration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Integration</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddIntegration(false)}
              >
                ×
              </button>
            </div>
            
            {/* Search and Categories */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  className="form-input pl-10 w-full"
                  placeholder="Search for integrations..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  All
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  CRM
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Communication
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Productivity
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Finance
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Developer
                </button>
              </div>
            </div>
            
            {/* Available Integrations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <div className="border rounded-lg p-4 flex items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                <svg className="h-8 w-8 mr-4" viewBox="0 0 24 24" fill="#1DA1F2">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                </svg>
                <div>
                  <h3 className="font-medium">Twitter</h3>
                  <p className="text-sm text-gray-500">Send automated tweets</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                <svg className="h-8 w-8 mr-4" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" fill="#E4405F" />
                </svg>
                <div>
                  <h3 className="font-medium">Instagram</h3>
                  <p className="text-sm text-gray-500">Post automatically</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                <svg className="h-8 w-8 mr-4" viewBox="0 0 24 24" fill="#0078D7">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#0078D7" />
                </svg>
                <div>
                  <h3 className="font-medium">Microsoft Teams</h3>
                  <p className="text-sm text-gray-500">Send notifications</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                <svg className="h-8 w-8 mr-4" viewBox="0 0 24 24" fill="#EA4335">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335" />
                </svg>
                <div>
                  <h3 className="font-medium">Gmail</h3>
                  <p className="text-sm text-gray-500">Send emails automatically</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                <svg className="h-8 w-8 mr-4" viewBox="0 0 24 24" fill="#2EB67D">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.687 8.834a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.166 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.166 17.687a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.312A2.527 2.527 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" />
                </svg>
                <div>
                  <h3 className="font-medium">Slack</h3>
                  <p className="text-sm text-gray-500">Send notifications</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 flex items-center hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                <Database className="h-8 w-8 mr-4 text-blue-700" />
                <div>
                  <h3 className="font-medium">PostgreSQL</h3>
                  <p className="text-sm text-gray-500">Connect to database</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="btn btn-outline mr-2"
                onClick={() => setShowAddIntegration(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // In a real app, this would connect to the selected integration
                  setShowAddIntegration(false);
                }}
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* API Documentation Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">API Documentation</h2>
          <a 
            href="#" 
            className="text-primary-600 hover:text-primary-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Full Documentation
          </a>
        </div>
        
        <p className="text-gray-600 mb-6">
          Use our REST API to integrate FlowForge with your custom applications. Here are some example endpoints:
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm">
            <code>
              <span className="text-green-600">GET</span> /api/v1/workflows<br />
              <span className="text-blue-600">GET</span> /api/v1/workflows/:id<br />
              <span className="text-yellow-600">POST</span> /api/v1/workflows<br />
              <span className="text-purple-600">PUT</span> /api/v1/workflows/:id<br />
              <span className="text-red-600">DELETE</span> /api/v1/workflows/:id<br />
            </code>
          </pre>
        </div>
        
        <div className="mt-6 flex">
          <button className="btn btn-outline mr-4">
            <Code className="h-5 w-5 mr-2" />
            Get API Key
          </button>
          <button className="btn btn-outline">
            <Webhook className="h-5 w-5 mr-2" />
            Configure Webhooks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;