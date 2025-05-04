import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy,
  MoreVertical,
  FileText
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Forms: React.FC = () => {
  const { forms, deleteForm, addForm } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter forms by search term
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const success = deleteForm(id);
      if (success) {
        addToast('Form deleted successfully', 'success');
      } else {
        addToast('Failed to delete form', 'error');
      }
    }
  };
  
  const handleDuplicate = (formId: string) => {
    const formToDuplicate = forms.find(f => f.id === formId);
    if (formToDuplicate) {
      // Create a duplicate form but change the name to indicate it's a copy
      const { id, createdAt, updatedAt, ...rest } = formToDuplicate;
      const duplicatedForm = {
        ...rest,
        name: `${rest.name} (Copy)`
      };
      
      // Create the new form
      try {
        const newForm = addForm(duplicatedForm);
        addToast('Form duplicated successfully', 'success');
      } catch (error) {
        addToast('Failed to duplicate form', 'error');
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-500">Create and manage digital forms</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/forms/new')}
        >
          <Plus className="h-5 w-5" />
          Create Form
        </button>
      </header>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Forms Grid */}
      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map(form => (
            <div key={form.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-2 rounded-md text-primary-700 mr-3">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{form.name}</h3>
                      <p className="text-sm text-gray-500">
                        {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'}
                      </p>
                    </div>
                  </div>
                  <div className="dropdown dropdown-end">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                  {form.description}
                </p>
                
                <div className="mt-4 text-xs text-gray-500">
                  Last updated: {new Date(form.updatedAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 flex justify-between">
                <button
                  className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                  onClick={() => navigate(`/forms/${form.id}`)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                
                <button
                  className="text-secondary-600 hover:text-secondary-800 flex items-center text-sm"
                  onClick={() => handleDuplicate(form.id)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </button>
                
                <button
                  className="text-error-600 hover:text-error-800 flex items-center text-sm"
                  onClick={() => handleDelete(form.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No forms match your search criteria.' : 'You haven\'t created any forms yet.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/forms/new')}
          >
            <Plus className="h-5 w-5" />
            Create Form
          </button>
        </div>
      )}
    </div>
  );
};

export default Forms;