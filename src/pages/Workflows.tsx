import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Play,
  Pause,
  Archive,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

const Workflows: React.FC = () => {
  const { workflows, deleteWorkflow, updateWorkflow } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter workflows by search term and status
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || workflow.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      const success = deleteWorkflow(id);
      if (success) {
        addToast("Workflow deleted successfully", "success");
      } else {
        addToast("Failed to delete workflow", "error");
      }
    }
  };

  const handleStatusChange = (
    id: string,
    status: "active" | "draft" | "archived"
  ) => {
    const updatedWorkflow = updateWorkflow(id, { status });
    if (updatedWorkflow) {
      addToast(
        `Workflow ${
          status === "active"
            ? "activated"
            : status === "draft"
            ? "paused"
            : "archived"
        } successfully`,
        "success"
      );
    } else {
      addToast("Failed to update workflow status", "error");
    }
  };

  const handleDuplicate = (workflowId: string) => {
    const workflowToDuplicate = workflows.find((w) => w.id === workflowId);
    if (workflowToDuplicate) {
      // Create a duplicate workflow but change the name to indicate it's a copy
      const { ...rest } = workflowToDuplicate;
      const duplicatedWorkflow = {
        ...rest,
        name: `${rest.name} (Copy)`,
        status: "draft" as const,
      };

      // Actually create the new workflow
      try {
        updateWorkflow(workflowId, duplicatedWorkflow);
        addToast("Workflow duplicated successfully", "success");
      } catch {
        addToast("Failed to duplicate workflow", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-500">Create and manage business workflows</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/workflows/new")}
        >
          <Plus className="h-5 w-5" />
          Create Workflow
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
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Workflows List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredWorkflows.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Workflow Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkflows.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {workflow.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {workflow.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        workflow.status === "active"
                          ? "bg-success-100 text-success-800"
                          : ""
                      }
                      ${
                        workflow.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : ""
                      }
                      ${
                        workflow.status === "archived"
                          ? "bg-warning-100 text-warning-800"
                          : ""
                      }
                    `}
                    >
                      {workflow.status.charAt(0).toUpperCase() +
                        workflow.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {workflow.status === "active" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(workflow.id, "draft")
                          }
                          className="text-gray-600 hover:text-gray-900"
                          title="Pause workflow"
                        >
                          <Pause className="h-5 w-5" />
                        </button>
                      ) : workflow.status === "draft" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(workflow.id, "active")
                          }
                          className="text-success-600 hover:text-success-800"
                          title="Activate workflow"
                        >
                          <Play className="h-5 w-5" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => navigate(`/workflows/${workflow.id}`)}
                        className="text-primary-600 hover:text-primary-800"
                        title="Edit workflow"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(workflow.id)}
                        className="text-secondary-600 hover:text-secondary-800"
                        title="Duplicate workflow"
                      >
                        <Copy className="h-5 w-5" />
                      </button>

                      {workflow.status !== "archived" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(workflow.id, "archived")
                          }
                          className="text-warning-600 hover:text-warning-800"
                          title="Archive workflow"
                        >
                          <Archive className="h-5 w-5" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="text-error-600 hover:text-error-800"
                        title="Delete workflow"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No workflows found. Create a new one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflows;
