import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Users as UsersIcon,
  Mail,
  Building,
  UserPlus,
  Shield,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const Users: React.FC = () => {
  const { users, teams, addTeam, deleteTeam, updateUserApprovalRole } = useApp();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [, setSelectedTeam] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    teamId: "",
    approvalRole: "",
  });
  
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    parentId: "",
    members: [] as string[],
  });

  // Filter users by search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    // In a real app, we would add the user to the database
    addToast("User added successfully", "success");
    setShowAddUser(false);
    setNewUser({
      name: "",
      email: "",
      role: "user",
      teamId: "",
      approvalRole: "",
    });
  };
  
  const handleAddTeam = () => {
    if (!newTeam.name) {
      addToast("Please enter a team name", "error");
      return;
    }

    try {
      const team = addTeam({
        name: newTeam.name,
        description: newTeam.description,
        parentId: newTeam.parentId || undefined,
        members: newTeam.members,
      });
      
      addToast(`Team "${team.name}" created successfully`, "success");
      setNewTeam({
        name: "",
        description: "",
        parentId: "",
        members: [],
      });
    } catch {
      addToast("Failed to create team", "error");
    }
  };
  
  // const handleUpdateTeam = (teamId: string, updates: Record<string, unknown>) => {
  //   try {
  //     const updated = updateTeam(teamId, updates);
  //     if (updated) {
  //       addToast(`Team "${updated.name}" updated successfully`, "success");
  //     } else {
  //       addToast("Team not found", "error");
  //     }
  //     addToast("Failed to update team", "error");
  //   }
  // };
  
  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        const success = deleteTeam(teamId);
        if (success) {
          addToast("Team deleted successfully", "success");
        } else {
          addToast("Team not found", "error");
        }
      } catch {
        addToast("Failed to delete team", "error");
      }
    }
  };
  
  // const handleAddUserToTeam = (userId: string, teamId: string) => {
  //   try {
  //     const success = addUserToTeam(userId, teamId);
  //     if (success) {
  //       const user = users.find(u => u.id === userId);
  //       const team = teams.find(t => t.id === teamId);
  //       addToast(`Added ${user?.name || 'User'} to ${team?.name || 'team'}`, "success");
  //     } else {
  //       addToast("Failed to add user to team", "error");
  //     }
  //     addToast("An error occurred", "error");
  //   }
  // };
  
  // const handleRemoveUserFromTeam = (userId: string, teamId: string) => {
  //   try {
  //     const success = removeUserFromTeam(userId, teamId);
  //     if (success) {
  //       const user = users.find(u => u.id === userId);
  //       const team = teams.find(t => t.id === teamId);
  //       addToast(`Removed ${user?.name || 'User'} from ${team?.name || 'team'}`, "success");
  //     } else {
  //       addToast("Failed to remove user from team", "error");
  //     }
  //     addToast("An error occurred", "error");
  //   }
  // };
  
  const handleUpdateApprovalRole = (userId: string, approvalRole: string) => {
    try {
      const success = updateUserApprovalRole(userId, approvalRole);
      if (success) {
        const user = users.find(u => u.id === userId);
        addToast(`Updated approval role for ${user?.name || 'User'}`, "success");
      } else {
        addToast("Failed to update approval role", "error");
      }
    } catch {
      addToast("An error occurred", "error");
    }
  };
  
  const toggleTeamExpanded = (teamId: string) => {
    setExpandedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId) 
        : [...prev, teamId]
    );
  };
  
  const getChildTeams = (parentId: string) => {
    return teams.filter(team => team.parentId === parentId);
  };
  
  const getRootTeams = () => {
    return teams.filter(team => !team.parentId);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Teams</h1>
          <p className="text-gray-500">Manage users and set permissions</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="btn btn-outline" 
            onClick={() => setShowTeamModal(true)}
          >
            <UsersIcon className="h-5 w-5" />
            Manage Teams
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddUser(true)}
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="manager">Managers</option>
            <option value="user">Regular Users</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredUsers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          User ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          user.role === "admin"
                            ? "bg-primary-100 text-primary-800"
                            : ""
                        }
                        ${
                          user.role === "manager"
                            ? "bg-accent-100 text-accent-800"
                            : ""
                        }
                        ${user.role === "user" ? "bg-gray-100 text-gray-800" : ""}
                      `}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      
                      {/* Show approval role if exists */}
                      {user.approvalRole && (
                        <span className="mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                          <Shield className="h-3 w-3 mr-1" />
                          {user.approvalRole.charAt(0).toUpperCase() + user.approvalRole.slice(1)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                    {/* Show team if user belongs to one */}
                    {user.teamId && (
                      <div className="text-xs text-gray-500 mt-1">
                        <Building className="h-3 w-3 inline mr-1" />
                        {teams.find(t => t.id === user.teamId)?.name || "Unknown team"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-800"
                        title="Edit user"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        className="text-accent-600 hover:text-accent-800"
                        title="Set approval role"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowApprovalModal(true);
                        }}
                      >
                        <Shield className="h-5 w-5" />
                      </button>
                      <button
                        className="text-primary-600 hover:text-primary-800"
                        title="Manage team membership"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowTeamModal(true);
                        }}
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                      <button
                        className="text-error-600 hover:text-error-800"
                        title="Delete user"
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
              No users found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddUser(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="form-label" htmlFor="user-name">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="user-name"
                    type="text"
                    className="form-input pl-10"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="form-label" htmlFor="user-email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="user-email"
                    type="email"
                    className="form-input pl-10"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="form-label" htmlFor="user-role">
                  Role
                </label>
                <select
                  id="user-role"
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                >
                  <option value="user">Regular User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="btn btn-outline"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Team Management</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowTeamModal(false)}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Creation Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Create New Team</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="form-label">Team Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTeam.name}
                      onChange={(e) =>
                        setNewTeam((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter team name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={newTeam.description}
                      onChange={(e) =>
                        setNewTeam((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter team description"
                    />
                  </div>

                  <div className="form-control">
                    <label className="form-label">Parent Team (Optional)</label>
                    <select
                      className="form-select"
                      value={newTeam.parentId}
                      onChange={(e) =>
                        setNewTeam((prev) => ({
                          ...prev,
                          parentId: e.target.value,
                        }))
                      }
                    >
                      <option value="">None (Root Team)</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="form-label">Initial Members</label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            className="mr-2"
                            checked={newTeam.members.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTeam((prev) => ({
                                  ...prev,
                                  members: [...prev.members, user.id],
                                }));
                              } else {
                                setNewTeam((prev) => ({
                                  ...prev,
                                  members: prev.members.filter(
                                    (id) => id !== user.id
                                  ),
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`user-${user.id}`}>
                            {user.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-full"
                    onClick={handleAddTeam}
                  >
                    Create Team
                  </button>
                </div>
              </div>

              {/* Team Hierarchy View */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Team Hierarchy</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[50vh] overflow-y-auto">
                  {getRootTeams().length > 0 ? (
                    <ul className="space-y-2">
                      {getRootTeams().map((team) => (
                        <li key={team.id} className="border-b border-gray-100 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getChildTeams(team.id).length > 0 ? (
                                <button
                                  className="mr-2 text-gray-500"
                                  onClick={() => toggleTeamExpanded(team.id)}
                                >
                                  {expandedTeams.includes(team.id) ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-5 h-5 mr-2"></span>
                              )}
                              <span className="font-medium">
                                <Building className="h-4 w-4 inline mr-1 text-primary-500" />
                                {team.name}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className="text-primary-600 hover:text-primary-800"
                                onClick={() => {
                                  setSelectedTeam(team.id);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                className="text-error-600 hover:text-error-800"
                                onClick={() => handleDeleteTeam(team.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Team members */}
                          <div className="ml-7 mt-1 text-sm text-gray-500">
                            {team.members.length} members
                          </div>
                          
                          {/* Child teams */}
                          {expandedTeams.includes(team.id) && getChildTeams(team.id).length > 0 && (
                            <ul className="ml-6 mt-2 space-y-2">
                              {getChildTeams(team.id).map((childTeam) => (
                                <li key={childTeam.id} className="border-b border-gray-100 pb-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      <Building className="h-4 w-4 inline mr-1 text-accent-500" />
                                      {childTeam.name}
                                    </span>
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-primary-600 hover:text-primary-800"
                                        onClick={() => {
                                          setSelectedTeam(childTeam.id);
                                        }}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </button>
                                      <button
                                        className="text-error-600 hover:text-error-800"
                                        onClick={() => handleDeleteTeam(childTeam.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="ml-5 mt-1 text-sm text-gray-500">
                                    {childTeam.members.length} members
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No teams created yet. Create your first team.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="btn btn-outline"
                onClick={() => setShowTeamModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Role Modal */}
      {showApprovalModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Set Approval Role</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedUser(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2">
                  <span className="font-medium">User: </span>
                  {users.find(u => u.id === selectedUser)?.name}
                </p>
              </div>

              <div className="form-control">
                <label className="form-label">Approval Role</label>
                <select
                  className="form-select"
                  value={users.find(u => u.id === selectedUser)?.approvalRole || ""}
                  onChange={(e) => {
                    handleUpdateApprovalRole(selectedUser, e.target.value);
                  }}
                >
                  <option value="">None</option>
                  <option value="approver">Approver</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin Approver</option>
                </select>
              </div>

              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Role Descriptions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-medium">Approver:</span> Can approve workflow items</li>
                  <li><span className="font-medium">Reviewer:</span> Can review but not approve</li>
                  <li><span className="font-medium">Admin Approver:</span> Can approve any workflow item</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedUser(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
