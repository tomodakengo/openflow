import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import {
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Save,
  Mail,
  Smartphone,
  Clock,
  FileText,
} from "lucide-react";

const Settings: React.FC = () => {
  const { currentUser } = useApp();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileSettings, setProfileSettings] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    jobTitle: "Product Manager",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en-US",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskAssignments: true,
    taskComments: true,
    taskStatusChanges: true,
    workflowUpdates: true,
    dailyDigest: false,
    weeklyDigest: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordLastChanged: "2023-01-15T10:30:00Z",
    sessionTimeout: "30",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    compactView: false,
    showGuides: true,
    animationsEnabled: true,
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSecurityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAppearanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save settings to the backend
    addToast("Settings saved successfully", "success");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Manage your account and application preferences
        </p>
      </header>

      <div className="bg-white rounded-lg shadow">
        <div className="md:flex">
          {/* Tabs Navigation */}
          <div className="md:w-64 flex-shrink-0 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "profile"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </button>

              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "notifications"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </button>

              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "security"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Shield className="mr-3 h-5 w-5" />
                Security
              </button>

              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "appearance"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                <Globe className="mr-3 h-5 w-5" />
                Appearance
              </button>

              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "data"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("data")}
              >
                <Database className="mr-3 h-5 w-5" />
                Data & Privacy
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="p-6 flex-1">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Profile Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                      <label className="form-label" htmlFor="profile-name">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="profile-name"
                          name="name"
                          type="text"
                          className="form-input pl-10"
                          value={profileSettings.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2">
                      <label className="form-label" htmlFor="profile-email">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="profile-email"
                          name="email"
                          type="email"
                          className="form-input pl-10"
                          value={profileSettings.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                      <label className="form-label" htmlFor="profile-jobTitle">
                        Job Title
                      </label>
                      <input
                        id="profile-jobTitle"
                        name="jobTitle"
                        type="text"
                        className="form-input"
                        value={profileSettings.jobTitle}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="w-full md:w-1/2">
                      <label className="form-label" htmlFor="profile-phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Smartphone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="profile-phone"
                          name="phone"
                          type="tel"
                          className="form-input pl-10"
                          value={profileSettings.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                      <label className="form-label" htmlFor="profile-timezone">
                        Timezone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="profile-timezone"
                          name="timezone"
                          className="form-select pl-10"
                          value={profileSettings.timezone}
                          onChange={handleProfileChange}
                        >
                          <option value="America/New_York">
                            Eastern Time (US & Canada)
                          </option>
                          <option value="America/Chicago">
                            Central Time (US & Canada)
                          </option>
                          <option value="America/Denver">
                            Mountain Time (US & Canada)
                          </option>
                          <option value="America/Los_Angeles">
                            Pacific Time (US & Canada)
                          </option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2">
                      <label className="form-label" htmlFor="profile-language">
                        Language
                      </label>
                      <select
                        id="profile-language"
                        name="language"
                        className="form-select"
                        value={profileSettings.language}
                        onChange={handleProfileChange}
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                        <option value="es-ES">Spanish</option>
                        <option value="ja-JP">Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Notification Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Notification Channels
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <span>Email Notifications</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            id="emailNotifications"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.emailNotifications}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="emailNotifications"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.emailNotifications
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 text-gray-400 mr-2" />
                          <span>Push Notifications</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            id="pushNotifications"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.pushNotifications}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="pushNotifications"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.pushNotifications
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Notification Types
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Task Assignments</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="taskAssignments"
                            id="taskAssignments"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.taskAssignments}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="taskAssignments"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.taskAssignments
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Task Comments</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="taskComments"
                            id="taskComments"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.taskComments}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="taskComments"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.taskComments
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Task Status Changes</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="taskStatusChanges"
                            id="taskStatusChanges"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.taskStatusChanges}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="taskStatusChanges"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.taskStatusChanges
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Workflow Updates</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="workflowUpdates"
                            id="workflowUpdates"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.workflowUpdates}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="workflowUpdates"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.workflowUpdates
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Summary Reports
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Daily Digest</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="dailyDigest"
                            id="dailyDigest"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.dailyDigest}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="dailyDigest"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.dailyDigest
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Weekly Digest</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="weeklyDigest"
                            id="weeklyDigest"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={notificationSettings.weeklyDigest}
                            onChange={handleNotificationChange}
                          />
                          <label
                            htmlFor="weeklyDigest"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.weeklyDigest
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Security Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            Two-Factor Authentication
                          </span>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="twoFactorEnabled"
                            id="twoFactorEnabled"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={securitySettings.twoFactorEnabled}
                            onChange={handleSecurityChange}
                          />
                          <label
                            htmlFor="twoFactorEnabled"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              securitySettings.twoFactorEnabled
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Password</span>
                          <span className="text-sm text-gray-500">
                            Last changed:{" "}
                            {new Date(
                              securitySettings.passwordLastChanged
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <button className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Session Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="form-label" htmlFor="session-timeout">
                          Session Timeout (minutes)
                        </label>
                        <select
                          id="session-timeout"
                          name="sessionTimeout"
                          className="form-select"
                          value={securitySettings.sessionTimeout}
                          onChange={handleSecurityChange}
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                        </select>
                      </div>

                      <div>
                        <button className="px-3 py-1 text-sm text-error-600 border border-error-600 rounded-md hover:bg-error-50 transition-colors">
                          Sign Out All Devices
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Appearance Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="form-label" htmlFor="app-theme">
                          Application Theme
                        </label>
                        <select
                          id="app-theme"
                          name="theme"
                          className="form-select"
                          value={appearanceSettings.theme}
                          onChange={handleAppearanceChange}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">Use System Theme</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Layout & Behavior
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Compact View</span>
                          <p className="text-sm text-gray-500">
                            Reduce white space to show more content
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="compactView"
                            id="compactView"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={appearanceSettings.compactView}
                            onChange={handleAppearanceChange}
                          />
                          <label
                            htmlFor="compactView"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              appearanceSettings.compactView
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Show Guides</span>
                          <p className="text-sm text-gray-500">
                            Display help text and tooltips
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="showGuides"
                            id="showGuides"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={appearanceSettings.showGuides}
                            onChange={handleAppearanceChange}
                          />
                          <label
                            htmlFor="showGuides"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              appearanceSettings.showGuides
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Enable Animations</span>
                          <p className="text-sm text-gray-500">
                            Use animations for transitions and effects
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            name="animationsEnabled"
                            id="animationsEnabled"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={appearanceSettings.animationsEnabled}
                            onChange={handleAppearanceChange}
                          />
                          <label
                            htmlFor="animationsEnabled"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              appearanceSettings.animationsEnabled
                                ? "bg-primary-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Data & Privacy Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Data Export
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Export all your data from the platform. This includes all
                      workflows, forms, tasks, and account information.
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 flex items-center text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                        <FileText className="h-4 w-4 mr-1" />
                        Export as JSON
                      </button>
                      <button className="px-3 py-1 flex items-center text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                        <FileText className="h-4 w-4 mr-1" />
                        Export as CSV
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Data Retention
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Configure how long we keep your data. Completed workflows
                      and tasks can be automatically archived or deleted after a
                      specified period.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="form-label"
                          htmlFor="archive-completed"
                        >
                          Archive completed workflows after
                        </label>
                        <select
                          id="archive-completed"
                          name="archiveCompleted"
                          className="form-select"
                        >
                          <option value="never">Never (keep all data)</option>
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="180">6 months</option>
                          <option value="365">1 year</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label" htmlFor="delete-archived">
                          Delete archived data after
                        </label>
                        <select
                          id="delete-archived"
                          name="deleteArchived"
                          className="form-select"
                        >
                          <option value="never">Never (keep all data)</option>
                          <option value="180">6 months</option>
                          <option value="365">1 year</option>
                          <option value="730">2 years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-error-50 rounded-lg border border-error-100">
                    <h3 className="font-medium text-error-900 mb-3">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-error-600 mb-4">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <button className="px-3 py-1 text-sm text-white bg-error-600 rounded-md hover:bg-error-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button (fixed for all tabs) */}
            <div className="mt-8 flex justify-end">
              <button className="btn btn-primary" onClick={saveSettings}>
                <Save className="h-5 w-5 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
