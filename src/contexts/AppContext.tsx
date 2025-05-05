import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
  created_at?: string;
  updated_at?: string;
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
  dependencies?: string[];
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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setAuthStateFromSupabase: (session: Session) => Promise<void>;
  loadUsers: () => Promise<void>;
  loadTeams: () => Promise<void>;
  loadWorkflows: () => Promise<void>;
  loadForms: () => Promise<void>;
  loadTasks: () => Promise<void>;
  getWorkflow: (id: string) => Promise<Workflow | null>;
  addWorkflow: (
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
  ) => Promise<Workflow>;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => Promise<Workflow | null>;
  deleteWorkflow: (id: string) => Promise<boolean>;
  getForm: (id: string) => Promise<Form | null>;
  addForm: (form: Omit<Form, "id" | "createdAt" | "updatedAt">) => Promise<Form>;
  updateForm: (id: string, form: Partial<Form>) => Promise<Form | null>;
  deleteForm: (id: string) => Promise<boolean>;
  getTask: (id: string) => Promise<Task | null>;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt"> & { dependencies?: string[] }) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task> & { dependencies?: string[] }) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  getTeam: (id: string) => Promise<Team | null>;
  addTeam: (team: Omit<Team, "id" | "createdAt" | "updatedAt">) => Promise<Team>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<Team | null>;
  deleteTeam: (id: string) => Promise<boolean>;
  addUserToTeam: (userId: string, teamId: string) => Promise<boolean>;
  removeUserFromTeam: (userId: string, teamId: string) => Promise<boolean>;
  updateUserApprovalRole: (userId: string, approvalRole: string) => Promise<boolean>;
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
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          await setAuthStateFromSupabase(data.session);
        }
        
        await Promise.all([
          loadUsers(),
          loadTeams(),
          loadWorkflows(),
          loadForms(),
          loadTasks()
        ]);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await setAuthStateFromSupabase(session);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setAuthStateFromSupabase = async (session: Session): Promise<void> => {
    const userEmail = session.user.email;
    if (!userEmail) return;
    
    try {
      // Check if user exists in Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error fetching user:", userError);
        return;
      }
      
      const user = userData as User | null;
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        const newUser: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || userEmail.split('@')[0],
          email: userEmail,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { error: insertError } = await supabase
          .from('users')
          .insert(newUser);
          
        if (insertError) {
          console.error("Error creating user:", insertError);
          return;
        }
        
        setCurrentUser(newUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error in setAuthStateFromSupabase:", error);
    }
  };
  
  const loadUsers = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (error) {
        console.error("Error loading users:", error);
        return;
      }
      
      setUsers(data as User[]);
    } catch (error) {
      console.error("Error in loadUsers:", error);
    }
  };
  
  const loadTeams = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*');
        
      if (error) {
        console.error("Error loading teams:", error);
        return;
      }
      
      setTeams(data as Team[]);
    } catch (error) {
      console.error("Error in loadTeams:", error);
    }
  };
  
  const loadWorkflows = async (): Promise<void> => {
    try {
      const { data: workflowsData, error: workflowsError } = await supabase
        .from('workflows')
        .select('*');
        
      if (workflowsError) {
        console.error("Error loading workflows:", workflowsError);
        return;
      }
      
      const workflowsWithSteps = await Promise.all(
        workflowsData.map(async (workflow) => {
          const { data: stepsData, error: stepsError } = await supabase
            .from('workflow_steps')
            .select('*')
            .eq('workflow_id', workflow.id);
            
          if (stepsError) {
            console.error(`Error loading steps for workflow ${workflow.id}:`, stepsError);
            return { ...workflow, steps: [] };
          }
          
          return { ...workflow, steps: stepsData };
        })
      );
      
      setWorkflows(workflowsWithSteps as Workflow[]);
    } catch (error) {
      console.error("Error in loadWorkflows:", error);
    }
  };
  
  const loadForms = async (): Promise<void> => {
    try {
      const { data: formsData, error: formsError } = await supabase
        .from('forms')
        .select('*');
        
      if (formsError) {
        console.error("Error loading forms:", formsError);
        return;
      }
      
      const formsWithFields = await Promise.all(
        formsData.map(async (form) => {
          const { data: fieldsData, error: fieldsError } = await supabase
            .from('form_fields')
            .select('*')
            .eq('form_id', form.id)
            .order('order', { ascending: true });
            
          if (fieldsError) {
            console.error(`Error loading fields for form ${form.id}:`, fieldsError);
            return { ...form, fields: [] };
          }
          
          return { ...form, fields: fieldsData };
        })
      );
      
      setForms(formsWithFields as Form[]);
    } catch (error) {
      console.error("Error in loadForms:", error);
    }
  };
  
  const loadTasks = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, task_dependencies(depends_on_task_id)');
        
      if (error) {
        console.error("Error loading tasks:", error);
        return;
      }
      
      const tasksWithDependencies = data.map(task => {
        const dependencies = task.task_dependencies?.map((dep: { depends_on_task_id: string }) => dep.depends_on_task_id) || [];
        const { ...taskWithoutDeps } = task;
        delete taskWithoutDeps.task_dependencies;
        return { ...taskWithoutDeps, dependencies };
      });
      
      setTasks(tasksWithDependencies as Task[]);
    } catch (error) {
      console.error("Error in loadTasks:", error);
    }
  };

  const getWorkflow = async (id: string): Promise<Workflow | null> => {
    try {
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();
        
      if (workflowError) {
        console.error(`Error fetching workflow ${id}:`, workflowError);
        return null;
      }
      
      const { data: steps, error: stepsError } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('workflow_id', id);
        
      if (stepsError) {
        console.error(`Error fetching steps for workflow ${id}:`, stepsError);
        return { ...workflow, steps: [] } as Workflow;
      }
      
      return { ...workflow, steps } as Workflow;
    } catch (error) {
      console.error(`Error in getWorkflow(${id}):`, error);
      return null;
    }
  };
  
  const getForm = async (id: string): Promise<Form | null> => {
    try {
      const { data: form, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();
        
      if (formError) {
        console.error(`Error fetching form ${id}:`, formError);
        return null;
      }
      
      const { data: fields, error: fieldsError } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_id', id)
        .order('order', { ascending: true });
        
      if (fieldsError) {
        console.error(`Error fetching fields for form ${id}:`, fieldsError);
        return { ...form, fields: [] } as Form;
      }
      
      return { ...form, fields } as Form;
    } catch (error) {
      console.error(`Error in getForm(${id}):`, error);
      return null;
    }
  };
  
  const getTask = async (id: string): Promise<Task | null> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, task_dependencies(depends_on_task_id)')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error(`Error fetching task ${id}:`, error);
        return null;
      }
      
      const dependencies = data.task_dependencies?.map((dep: { depends_on_task_id: string }) => dep.depends_on_task_id) || [];
      const { ...taskWithoutDeps } = data;
      delete taskWithoutDeps.task_dependencies;
      
      return { ...taskWithoutDeps, dependencies } as Task;
    } catch (error) {
      console.error(`Error in getTask(${id}):`, error);
      return null;
    }
  };
  
  const getTeam = async (id: string): Promise<Team | null> => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(user_id)')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error(`Error fetching team ${id}:`, error);
        return null;
      }
      
      const members = data.team_members?.map((member: { user_id: string }) => member.user_id) || [];
      const { ...teamWithoutMembers } = data;
      delete teamWithoutMembers.team_members;
      
      return { ...teamWithoutMembers, members } as Team;
    } catch (error) {
      console.error(`Error in getTeam(${id}):`, error);
      return null;
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

  const addWorkflow = async (
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
  ): Promise<Workflow> => {
    try {
      setIsLoading(true);
      
      const newWorkflow = {
        name: workflow.name,
        description: workflow.description,
        status: workflow.status,
        createdBy: currentUser?.id || 'unknown',
      };
      
      const { data, error } = await supabase
        .from('workflows')
        .insert(newWorkflow)
        .select()
        .single();
        
      if (error) {
        console.error("Error adding workflow:", error);
        throw error;
      }
      
      if (workflow.steps && workflow.steps.length > 0) {
        const stepsWithWorkflowId = workflow.steps.map(step => ({
          workflow_id: data.id,
          name: step.name,
          type: step.type,
          config: step.config,
          position: step.position
        }));
        
        const { error: stepsError } = await supabase
          .from('workflow_steps')
          .insert(stepsWithWorkflowId);
          
        if (stepsError) {
          console.error("Error adding workflow steps:", stepsError);
        }
      }
      
      await loadWorkflows();
      
      return { 
        ...data, 
        steps: workflow.steps || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Workflow;
    } catch (error) {
      console.error("Error in addWorkflow:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkflow = async (
    id: string,
    workflow: Partial<Workflow>
  ): Promise<Workflow | null> => {
    try {
      setIsLoading(true);
      
      const { steps, ...workflowData } = workflow;
      
      const { error } = await supabase
        .from('workflows')
        .update({
          name: workflowData.name,
          description: workflowData.description,
          status: workflowData.status
        })
        .eq('id', id);
        
      if (error) {
        console.error(`Error updating workflow ${id}:`, error);
        return null;
      }
      
      if (steps) {
        const { error: deleteError } = await supabase
          .from('workflow_steps')
          .delete()
          .eq('workflow_id', id);
          
        if (deleteError) {
          console.error(`Error deleting steps for workflow ${id}:`, deleteError);
        }
        
        if (steps.length > 0) {
          const stepsWithWorkflowId = steps.map(step => ({
            workflow_id: id,
            name: step.name,
            type: step.type,
            config: step.config,
            position: step.position
          }));
          
          const { error: insertError } = await supabase
            .from('workflow_steps')
            .insert(stepsWithWorkflowId);
            
          if (insertError) {
            console.error(`Error inserting steps for workflow ${id}:`, insertError);
          }
        }
      }
      
      await loadWorkflows();
      
      return await getWorkflow(id);
    } catch (error) {
      console.error(`Error in updateWorkflow(${id}):`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkflow = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error: stepsError } = await supabase
        .from('workflow_steps')
        .delete()
        .eq('workflow_id', id);
        
      if (stepsError) {
        console.error(`Error deleting steps for workflow ${id}:`, stepsError);
      }
      
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting workflow ${id}:`, error);
        return false;
      }
      
      await loadWorkflows();
      
      return true;
    } catch (error) {
      console.error(`Error in deleteWorkflow(${id}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addForm = async (
    form: Omit<Form, "id" | "createdAt" | "updatedAt">
  ): Promise<Form> => {
    try {
      setIsLoading(true);
      
      const newForm = {
        name: form.name,
        description: form.description,
        createdBy: currentUser?.id || 'unknown',
      };
      
      const { data, error } = await supabase
        .from('forms')
        .insert(newForm)
        .select()
        .single();
        
      if (error) {
        console.error("Error adding form:", error);
        throw error;
      }
      
      if (form.fields && form.fields.length > 0) {
        const fieldsWithFormId = form.fields.map((field, index) => ({
          form_id: data.id,
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required,
          order: index,
          options: field.options ? JSON.stringify(field.options) : null,
          placeholder: field.placeholder,
          default_value: field.defaultValue ? JSON.stringify(field.defaultValue) : null,
          validation: field.validation ? JSON.stringify(field.validation) : null
        }));
        
        const { error: fieldsError } = await supabase
          .from('form_fields')
          .insert(fieldsWithFormId);
          
        if (fieldsError) {
          console.error("Error adding form fields:", fieldsError);
        }
      }
      
      await loadForms();
      
      return { 
        ...data, 
        fields: form.fields || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Form;
    } catch (error) {
      console.error("Error in addForm:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = async (id: string, form: Partial<Form>): Promise<Form | null> => {
    try {
      setIsLoading(true);
      
      const { fields, ...formData } = form;
      
      const { error } = await supabase
        .from('forms')
        .update({
          name: formData.name,
          description: formData.description
        })
        .eq('id', id);
        
      if (error) {
        console.error(`Error updating form ${id}:`, error);
        return null;
      }
      
      if (fields) {
        const { error: deleteError } = await supabase
          .from('form_fields')
          .delete()
          .eq('form_id', id);
          
        if (deleteError) {
          console.error(`Error deleting fields for form ${id}:`, deleteError);
        }
        
        if (fields.length > 0) {
          const fieldsWithFormId = fields.map((field, index) => ({
            form_id: id,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            order: index,
            options: field.options ? JSON.stringify(field.options) : null,
            placeholder: field.placeholder,
            default_value: field.defaultValue ? JSON.stringify(field.defaultValue) : null,
            validation: field.validation ? JSON.stringify(field.validation) : null
          }));
          
          const { error: insertError } = await supabase
            .from('form_fields')
            .insert(fieldsWithFormId);
            
          if (insertError) {
            console.error(`Error inserting fields for form ${id}:`, insertError);
          }
        }
      }
      
      await loadForms();
      
      return await getForm(id);
    } catch (error) {
      console.error(`Error in updateForm(${id}):`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteForm = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error: fieldsError } = await supabase
        .from('form_fields')
        .delete()
        .eq('form_id', id);
        
      if (fieldsError) {
        console.error(`Error deleting fields for form ${id}:`, fieldsError);
      }
      
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting form ${id}:`, error);
        return false;
      }
      
      await loadForms();
      
      return true;
    } catch (error) {
      console.error(`Error in deleteForm(${id}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt"> & { dependencies?: string[] }
  ): Promise<Task> => {
    try {
      setIsLoading(true);
      
      const newTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate,
        assigned_to: task.assignedTo,
        workflow_id: task.workflowId
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
        
      if (error) {
        console.error("Error adding task:", error);
        throw error;
      }
      
      if (task.dependencies && task.dependencies.length > 0) {
        const dependenciesData = task.dependencies.map((dependsOnId: string) => ({
          task_id: data.id,
          depends_on_task_id: dependsOnId
        }));
        
        const { error: depsError } = await supabase
          .from('task_dependencies')
          .insert(dependenciesData);
          
        if (depsError) {
          console.error("Error adding task dependencies:", depsError);
        }
      }
      
      await loadTasks();
      
      return { 
        ...data, 
        dependencies: task.dependencies || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Task;
    } catch (error) {
      console.error("Error in addTask:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, task: Partial<Task> & { dependencies?: string[] }): Promise<Task | null> => {
    try {
      setIsLoading(true);
      
      const { dependencies, ...taskData } = task;
      
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          assigned_to: taskData.assignedTo,
          workflow_id: taskData.workflowId
        })
        .eq('id', id);
        
      if (error) {
        console.error(`Error updating task ${id}:`, error);
        return null;
      }
      
      if (dependencies) {
        const { error: deleteError } = await supabase
          .from('task_dependencies')
          .delete()
          .eq('task_id', id);
          
        if (deleteError) {
          console.error(`Error deleting dependencies for task ${id}:`, deleteError);
        }
        
        if (dependencies.length > 0) {
          const dependenciesData = dependencies.map((dependsOnId: string) => ({
            task_id: id,
            depends_on_task_id: dependsOnId
          }));
          
          const { error: insertError } = await supabase
            .from('task_dependencies')
            .insert(dependenciesData);
            
          if (insertError) {
            console.error(`Error inserting dependencies for task ${id}:`, insertError);
          }
        }
      }
      
      await loadTasks();
      
      return await getTask(id);
    } catch (error) {
      console.error(`Error in updateTask(${id}):`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error: depsError } = await supabase
        .from('task_dependencies')
        .delete()
        .eq('task_id', id);
        
      if (depsError) {
        console.error(`Error deleting dependencies for task ${id}:`, depsError);
      }
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting task ${id}:`, error);
        return false;
      }
      
      await loadTasks();
      
      return true;
    } catch (error) {
      console.error(`Error in deleteTask(${id}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addTeam = async (
    team: Omit<Team, "id" | "createdAt" | "updatedAt">
  ): Promise<Team> => {
    try {
      setIsLoading(true);
      
      const newTeam = {
        name: team.name,
        description: team.description,
        parent_id: team.parentId
      };
      
      const { data, error } = await supabase
        .from('teams')
        .insert(newTeam)
        .select()
        .single();
        
      if (error) {
        console.error("Error adding team:", error);
        throw error;
      }
      
      if (team.members && team.members.length > 0) {
        const teamMembersData = team.members.map(userId => ({
          team_id: data.id,
          user_id: userId
        }));
        
        const { error: membersError } = await supabase
          .from('team_members')
          .insert(teamMembersData);
          
        if (membersError) {
          console.error("Error adding team members:", membersError);
        }
      }
      
      await loadTeams();
      
      return { 
        ...data, 
        members: team.members || [],
        parentId: data.parent_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Team;
    } catch (error) {
      console.error("Error in addTeam:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeam = async (id: string, team: Partial<Team>): Promise<Team | null> => {
    try {
      setIsLoading(true);
      
      const { members, ...teamData } = team;
      
      const { error } = await supabase
        .from('teams')
        .update({
          name: teamData.name,
          description: teamData.description,
          parent_id: teamData.parentId
        })
        .eq('id', id);
        
      if (error) {
        console.error(`Error updating team ${id}:`, error);
        return null;
      }
      
      if (members) {
        const { error: deleteError } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', id);
          
        if (deleteError) {
          console.error(`Error deleting members for team ${id}:`, deleteError);
        }
        
        if (members.length > 0) {
          const teamMembersData = members.map(userId => ({
            team_id: id,
            user_id: userId
          }));
          
          const { error: insertError } = await supabase
            .from('team_members')
            .insert(teamMembersData);
            
          if (insertError) {
            console.error(`Error inserting members for team ${id}:`, insertError);
          }
        }
      }
      
      await loadTeams();
      
      return await getTeam(id);
    } catch (error) {
      console.error(`Error in updateTeam(${id}):`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeam = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', id);
        
      if (membersError) {
        console.error(`Error deleting members for team ${id}:`, membersError);
      }
      
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting team ${id}:`, error);
        return false;
      }
      
      await loadTeams();
      
      return true;
    } catch (error) {
      console.error(`Error in deleteTeam(${id}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addUserToTeam = async (userId: string, teamId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({ team_id: teamId, user_id: userId });
        
      if (memberError) {
        console.error(`Error adding user ${userId} to team ${teamId}:`, memberError);
        return false;
      }
      
      const { error: userError } = await supabase
        .from('users')
        .update({ team_id: teamId })
        .eq('id', userId);
        
      if (userError) {
        console.error(`Error updating user ${userId} team:`, userError);
        return false;
      }
      
      await Promise.all([loadUsers(), loadTeams()]);
      
      return true;
    } catch (error) {
      console.error(`Error in addUserToTeam(${userId}, ${teamId}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeUserFromTeam = async (userId: string, teamId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error: memberError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);
        
      if (memberError) {
        console.error(`Error removing user ${userId} from team ${teamId}:`, memberError);
        return false;
      }
      
      const { error: userError } = await supabase
        .from('users')
        .update({ team_id: null })
        .eq('id', userId);
        
      if (userError) {
        console.error(`Error updating user ${userId} team:`, userError);
        return false;
      }
      
      await Promise.all([loadUsers(), loadTeams()]);
      
      return true;
    } catch (error) {
      console.error(`Error in removeUserFromTeam(${userId}, ${teamId}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserApprovalRole = async (
    userId: string,
    approvalRole: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('users')
        .update({ approval_role: approvalRole })
        .eq('id', userId);
        
      if (error) {
        console.error(`Error updating user ${userId} approval role:`, error);
        return false;
      }
      
      await loadUsers();
      
      return true;
    } catch (error) {
      console.error(`Error in updateUserApprovalRole(${userId}, ${approvalRole}):`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    users,
    teams,
    workflows,
    forms,
    tasks,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAuthStateFromSupabase,
    loadUsers,
    loadTeams,
    loadWorkflows,
    loadForms,
    loadTasks,
    getWorkflow,
    getForm,
    getTask,
    getTeam,
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
