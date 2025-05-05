import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  mockUsers,
  mockWorkflows,
  mockForms,
  mockTasks,
  mockTeams,
} from "../data/mockData";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

interface Team {
  id: string;
  name: string;
  description: string;
  parentId?: string; // For hierarchical structure
  members: string[]; // Array of user IDs
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string; // Department/team association
  approvalRole?: string; // For approval chains (e.g., "approver", "reviewer")
  avatar?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "archived";
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

interface Form {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: unknown;
  validation?: Record<string, unknown>;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  dueDate: string;
  workflowId?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  teams: Team[];
  workflows: Workflow[];
  forms: Form[];
  tasks: Task[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthStateFromSupabase: (session: Session) => void;
  addWorkflow: (
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
  ) => Workflow;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => Workflow | null;
  deleteWorkflow: (id: string) => boolean;
  addForm: (form: Omit<Form, "id" | "createdAt" | "updatedAt">) => Form;
  updateForm: (id: string, form: Partial<Form>) => Form | null;
  deleteForm: (id: string) => boolean;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, task: Partial<Task>) => Task | null;
  deleteTask: (id: string) => boolean;
  addTeam: (team: Omit<Team, "id" | "createdAt" | "updatedAt">) => Team;
  updateTeam: (id: string, team: Partial<Team>) => Team | null;
  deleteTeam: (id: string) => boolean;
  addUserToTeam: (userId: string, teamId: string) => boolean;
  removeUserFromTeam: (userId: string, teamId: string) => boolean;
  updateUserApprovalRole: (userId: string, approvalRole: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows as unknown as Workflow[]);
  const [forms, setForms] = useState<Form[]>(mockForms as unknown as Form[]);
  const [tasks, setTasks] = useState<Task[]>(mockTasks as unknown as Task[]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in from Supabase session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthStateFromSupabase(data.session);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuthStateFromSupabase(session);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setAuthStateFromSupabase = (session: Session) => {
    const userEmail = session.user.email;
    if (!userEmail) return;
    
    let user = users.find((u) => u.email === userEmail);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      const newUser: User = {
        id: session.user.id,
        name: session.user.user_metadata.name || userEmail.split('@')[0],
        email: userEmail,
        role: 'user',
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return false;
      }
      
      if (data.session) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addWorkflow = (
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
  ): Workflow => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkflows([...workflows, newWorkflow]);
    return newWorkflow;
  };

  const updateWorkflow = (
    id: string,
    workflow: Partial<Workflow>
  ): Workflow | null => {
    const index = workflows.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const updatedWorkflow = {
      ...workflows[index],
      ...workflow,
      updatedAt: new Date().toISOString(),
    };

    const updatedWorkflows = [...workflows];
    updatedWorkflows[index] = updatedWorkflow;
    setWorkflows(updatedWorkflows);

    return updatedWorkflow;
  };

  const deleteWorkflow = (id: string): boolean => {
    const index = workflows.findIndex((w) => w.id === id);
    if (index === -1) return false;

    const updatedWorkflows = [...workflows];
    updatedWorkflows.splice(index, 1);
    setWorkflows(updatedWorkflows);

    return true;
  };

  const addForm = (
    form: Omit<Form, "id" | "createdAt" | "updatedAt">
  ): Form => {
    const newForm: Form = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setForms([...forms, newForm]);
    return newForm;
  };

  const updateForm = (id: string, form: Partial<Form>): Form | null => {
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const updatedForm = {
      ...forms[index],
      ...form,
      updatedAt: new Date().toISOString(),
    };

    const updatedForms = [...forms];
    updatedForms[index] = updatedForm;
    setForms(updatedForms);

    return updatedForm;
  };

  const deleteForm = (id: string): boolean => {
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return false;

    const updatedForms = [...forms];
    updatedForms.splice(index, 1);
    setForms(updatedForms);

    return true;
  };

  const addTask = (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Task => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id: string, task: Partial<Task>): Task | null => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTask = {
      ...tasks[index],
      ...task,
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);

    return updatedTask;
  };

  const deleteTask = (id: string): boolean => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    return true;
  };

  const addTeam = (
    team: Omit<Team, "id" | "createdAt" | "updatedAt">
  ): Team => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTeams([...teams, newTeam]);
    return newTeam;
  };

  const updateTeam = (id: string, team: Partial<Team>): Team | null => {
    const index = teams.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTeam = {
      ...teams[index],
      ...team,
      updatedAt: new Date().toISOString(),
    };

    const updatedTeams = [...teams];
    updatedTeams[index] = updatedTeam;
    setTeams(updatedTeams);

    return updatedTeam;
  };

  const deleteTeam = (id: string): boolean => {
    const index = teams.findIndex((t) => t.id === id);
    if (index === -1) return false;

    const updatedTeams = [...teams];
    updatedTeams.splice(index, 1);
    setTeams(updatedTeams);

    return true;
  };

  const addUserToTeam = (userId: string, teamId: string): boolean => {
    const teamIndex = teams.findIndex((t) => t.id === teamId);
    if (teamIndex === -1) return false;

    const userExists = users.some((u) => u.id === userId);
    if (!userExists) return false;

    // Check if user is already in the team
    if (teams[teamIndex].members.includes(userId)) return true;

    const updatedTeam = {
      ...teams[teamIndex],
      members: [...teams[teamIndex].members, userId],
      updatedAt: new Date().toISOString(),
    };

    const updatedTeams = [...teams];
    updatedTeams[teamIndex] = updatedTeam;
    setTeams(updatedTeams);

    const userIndex = users.findIndex((u) => u.id === userId);
    const updatedUser = {
      ...users[userIndex],
      teamId: teamId,
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);

    return true;
  };

  const removeUserFromTeam = (userId: string, teamId: string): boolean => {
    const teamIndex = teams.findIndex((t) => t.id === teamId);
    if (teamIndex === -1) return false;

    // Check if user is in the team
    if (!teams[teamIndex].members.includes(userId)) return true;

    const updatedTeam = {
      ...teams[teamIndex],
      members: teams[teamIndex].members.filter((id) => id !== userId),
      updatedAt: new Date().toISOString(),
    };

    const updatedTeams = [...teams];
    updatedTeams[teamIndex] = updatedTeam;
    setTeams(updatedTeams);

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        teamId: undefined,
      };

      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      setUsers(updatedUsers);
    }

    return true;
  };

  const updateUserApprovalRole = (userId: string, approvalRole: string): boolean => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return false;

    const updatedUser = {
      ...users[userIndex],
      approvalRole,
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);

    return true;
  };

  const value = {
    currentUser,
    users,
    teams,
    workflows,
    forms,
    tasks,
    isAuthenticated,
    login,
    logout,
    setAuthStateFromSupabase,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    addForm,
    updateForm,
    deleteForm,
    addTask,
    updateTask,
    deleteTask,
    addTeam,
    updateTeam,
    deleteTeam,
    addUserToTeam,
    removeUserFromTeam,
    updateUserApprovalRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
