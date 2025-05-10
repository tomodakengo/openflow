export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'admin' | 'manager' | 'user'
          team_id: string | null
          approval_role: 'approver' | 'reviewer' | 'admin' | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'admin' | 'manager' | 'user'
          team_id?: string | null
          approval_role?: 'approver' | 'reviewer' | 'admin' | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'admin' | 'manager' | 'user'
          team_id?: string | null
          approval_role?: 'approver' | 'reviewer' | 'admin' | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          team_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          team_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          team_id?: string
          user_id?: string
          created_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'active' | 'draft' | 'archived'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status: 'active' | 'draft' | 'archived'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'draft' | 'archived'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      workflow_steps: {
        Row: {
          id: string
          workflow_id: string
          name: string
          type: 'form' | 'task' | 'approval' | 'condition'
          config: Json
          position: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workflow_id: string
          name: string
          type: 'form' | 'task' | 'approval' | 'condition'
          config?: Json
          position?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workflow_id?: string
          name?: string
          type?: 'form' | 'task' | 'approval' | 'condition'
          config?: Json
          position?: Json
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          workflow_id: string
          source_id: string
          target_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workflow_id: string
          source_id: string
          target_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workflow_id?: string
          source_id?: string
          target_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      forms: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      form_fields: {
        Row: {
          id: string
          form_id: string
          name: string
          label: string
          type: string
          required: boolean
          order: number
          options: Json | null
          placeholder: string | null
          default_value: Json | null
          validation: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          name: string
          label: string
          type: string
          required?: boolean
          order: number
          options?: Json | null
          placeholder?: string | null
          default_value?: Json | null
          validation?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          name?: string
          label?: string
          type?: string
          required?: boolean
          order?: number
          options?: Json | null
          placeholder?: string | null
          default_value?: Json | null
          validation?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          assigned_to: string | null
          workflow_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status: 'todo' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date?: string | null
          assigned_to?: string | null
          workflow_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          assigned_to?: string | null
          workflow_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      task_dependencies: {
        Row: {
          task_id: string
          depends_on_task_id: string
          created_at: string
        }
        Insert: {
          task_id: string
          depends_on_task_id: string
          created_at?: string
        }
        Update: {
          task_id?: string
          depends_on_task_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}