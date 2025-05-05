export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string;
  approvalRole?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface Connection {
  source: string;
  target: string;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: string[];
  placeholder?: string;
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    allowMultiple?: boolean;
    acceptedTypes?: string;
    signatureType?: string;
    includeDate?: boolean;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  assignedTo: string | null;
  workflowId: string | null;
  dependencies?: string[];
  created_at: string;
  updated_at: string;
}

export type Database = {
  users: User[];
  teams: Team[];
  workflows: Workflow[];
  forms: Form[];
  tasks: Task[];
};
