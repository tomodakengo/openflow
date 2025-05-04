import React from 'react';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Video,
  ChevronDown,
  ExternalLink,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  Youtube
} from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500">Find answers, tutorials, and get support</p>
      </header>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 pr-4 py-3 text-lg w-full"
            placeholder="Search for help..."
          />
          <button className="absolute right-2 top-2 btn btn-primary">
            Search
          </button>
        </div>
      </div>
      
      {/* Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
          <div className="rounded-full p-3 bg-primary-100 text-primary-600 w-12 h-12 flex items-center justify-center mb-4">
            <Book className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Documentation</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive guides and references for all features and capabilities.
          </p>
          <a href="#" className="text-primary-600 hover:text-primary-800 flex items-center">
            Browse Documentation
            <ChevronDown className="h-4 w-4 ml-1 transform rotate-270" />
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
          <div className="rounded-full p-3 bg-secondary-100 text-secondary-600 w-12 h-12 flex items-center justify-center mb-4">
            <Video className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Video Tutorials</h2>
          <p className="text-gray-600 mb-4">
            Watch step-by-step tutorials to learn how to use our platform.
          </p>
          <a href="#" className="text-primary-600 hover:text-primary-800 flex items-center">
            Watch Tutorials
            <ChevronDown className="h-4 w-4 ml-1 transform rotate-270" />
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
          <div className="rounded-full p-3 bg-accent-100 text-accent-600 w-12 h-12 flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Community Forum</h2>
          <p className="text-gray-600 mb-4">
            Connect with other users, ask questions, and share your experiences.
          </p>
          <a href="#" className="text-primary-600 hover:text-primary-800 flex items-center">
            Join the Conversation
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
      
      {/* FAQs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50">
                <span className="font-medium">How do I create my first workflow?</span>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t">
                <p className="text-gray-600">
                  To create your first workflow, navigate to the Workflows page by clicking on "Workflows" in the sidebar menu. Then click the "Create Workflow" button. You'll be guided through the process of naming your workflow and adding steps. You can use drag-and-drop to add various steps like forms, approvals, and tasks to your workflow.
                </p>
              </div>
            </details>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50">
                <span className="font-medium">How do I add users to my account?</span>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t">
                <p className="text-gray-600">
                  To add users, go to the Users & Teams page from the sidebar. Click on "Add User" and fill in their email address and name. You can assign them a role (Admin, Manager, or User) which determines their permissions. New users will receive an email invitation to join your account.
                </p>
              </div>
            </details>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50">
                <span className="font-medium">Can I integrate with other tools?</span>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t">
                <p className="text-gray-600">
                  Yes, FlowForge supports integration with many popular business tools. You can set up integrations in the Integrations page. We offer built-in integrations with tools like Slack, Google Workspace, Microsoft 365, and more. For custom integrations, you can use our REST API or webhooks.
                </p>
              </div>
            </details>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50">
                <span className="font-medium">How do I create custom forms?</span>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t">
                <p className="text-gray-600">
                  To create custom forms, navigate to the Forms section from the sidebar and click "Create Form". You can add various field types (text, number, email, dropdown, etc.) to your form. Each field can be configured with validation rules and you can organize them in a logical order. Forms can then be used in your workflows.
                </p>
              </div>
            </details>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50">
                <span className="font-medium">How do I set up approval chains?</span>
                <ChevronDown className="h-5 w-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 border-t">
                <p className="text-gray-600">
                  Approval chains are set up within workflows. When building your workflow, add an "Approval" step after the form submission or task that requires approval. You can configure who needs to approve the request and whether it requires sequential approval from multiple people or just one approval from a group.
                </p>
              </div>
            </details>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a href="#" className="text-primary-600 hover:text-primary-800 flex items-center justify-center">
            View all FAQs
            <ChevronDown className="h-4 w-4 ml-1 transform rotate-270" />
          </a>
        </div>
      </div>
      
      {/* Contact Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Contact Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Mail className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="font-medium text-lg mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              Send us an email and we'll respond within 24 hours.
            </p>
            <a href="mailto:support@flowforge.com" className="text-primary-600 hover:text-primary-800">
              support@flowforge.com
            </a>
          </div>
          
          <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Phone className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="font-medium text-lg mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">
              Available Monday-Friday, 9am-5pm EST.
            </p>
            <a href="tel:+18001234567" className="text-primary-600 hover:text-primary-800">
              +1 (800) 123-4567
            </a>
          </div>
          
          <div className="border rounded-lg p-6 flex flex-col items-center text-center hover:border-primary-300 hover:bg-primary-50 transition-colors md:col-span-2 lg:col-span-1">
            <MessageCircle className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="font-medium text-lg mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Chat with a support representative in real-time.
            </p>
            <button className="btn btn-primary">
              Start Chat
            </button>
          </div>
        </div>
      </div>
      
      {/* Getting Started */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold">Getting Started Videos</h2>
          <a href="#" className="text-primary-600 hover:text-primary-800 flex items-center">
            <Youtube className="h-5 w-5 mr-1" />
            View Channel
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-16 border-l-primary-600 ml-1"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Introduction to FlowForge</h3>
              <p className="text-sm text-gray-600">Learn the basics of the platform and core features.</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-16 border-l-primary-600 ml-1"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Building Your First Workflow</h3>
              <p className="text-sm text-gray-600">Step-by-step guide to creating workflows.</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-16 border-l-primary-600 ml-1"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Advanced Form Building</h3>
              <p className="text-sm text-gray-600">Create powerful forms with conditional logic.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Documentation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Documentation Library</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="#" className="block border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">User Guide</h3>
                <p className="text-sm text-gray-600">Complete guide to using the platform as an end-user.</p>
              </div>
            </div>
          </a>
          
          <a href="#" className="block border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Administrator Guide</h3>
                <p className="text-sm text-gray-600">Setting up and managing your organization's account.</p>
              </div>
            </div>
          </a>
          
          <a href="#" className="block border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Workflow Builder Guide</h3>
                <p className="text-sm text-gray-600">Detailed instructions for building custom workflows.</p>
              </div>
            </div>
          </a>
          
          <a href="#" className="block border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">API Documentation</h3>
                <p className="text-sm text-gray-600">Reference for developers integrating with our platform.</p>
              </div>
            </div>
          </a>
          
          <a href="#" className="block border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Form Builder Guide</h3>
                <p className="text-sm text-gray-600">Instructions for creating and customizing forms.</p>
              </div>
            </div>
          </a>
          
          <a href="#" className="block border rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Integration Guide</h3>
                <p className="text-sm text-gray-600">Connecting FlowForge with other business tools.</p>
              </div>
            </div>
          </a>
        </div>
      </div>
      
      {/* Help Center Footer */}
      <div className="bg-primary-50 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <HelpCircle className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-4 max-w-lg mx-auto">
          Our support team is ready to assist you with any questions or issues you might have.
        </p>
        <button className="btn btn-primary mx-auto">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Help;