import { createClient } from '@supabase/supabase-js';
import { mockUsers, mockTeams, mockWorkflows, mockForms, mockTasks } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const createMockClient = () => {
  const authStateChangeCallbacks: Array<(event: string, session: any) => void> = [];
  
  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: new Date().getTime() / 1000 + 3600,
    token_type: 'bearer',
    user: {
      id: 'mock-user-id',
      email: 'admin@example.com',
      user_metadata: {
        name: 'Admin User'
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    }
  };
  
  const createPromise = <T>(data: T, error: any = null): Promise<{ data: T; error: any }> => {
    return Promise.resolve({ data, error });
  };
  
  let isAuthenticated = true;
  
  return {
    auth: {
      signUp: () => {
        isAuthenticated = true;
        return createPromise({ 
          user: mockSession.user, 
          session: mockSession
        });
      },
      signInWithPassword: () => {
        isAuthenticated = true;
        return createPromise({ 
          session: mockSession
        });
      },
      signOut: () => {
        console.log('Mock signOut called');
        isAuthenticated = false;
        authStateChangeCallbacks.forEach(callback => {
          callback('SIGNED_OUT', null);
        });
        return createPromise(null);
      },
      getSession: () => {
        return isAuthenticated 
          ? createPromise({ session: mockSession })
          : createPromise({ session: null });
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authStateChangeCallbacks.push(callback);
        setTimeout(() => {
          if (isAuthenticated) {
            callback('SIGNED_IN', mockSession);
          } else {
            callback('SIGNED_OUT', null);
          }
        }, 100);
        return {
          data: { subscription: { unsubscribe: () => {
            const index = authStateChangeCallbacks.indexOf(callback);
            if (index > -1) {
              authStateChangeCallbacks.splice(index, 1);
            }
          } } },
          error: null
        };
      }
    },
    from: (table: string) => {
      const getMockData = () => {
        switch (table) {
          case 'users':
            return mockUsers;
          case 'teams':
            return mockTeams;
          case 'workflows':
            return mockWorkflows;
          case 'forms':
            return mockForms;
          case 'tasks':
            return mockTasks;
          default:
            return [];
        }
      };

      return {
        select: (_columns = '*') => {
          const data = getMockData();
          
          const selectPromise = Promise.resolve({ data, error: null });
          
          return Object.assign(selectPromise, {
            eq: (column: string, value: any) => {
              const filtered = data.filter((item: any) => item[column] === value);
              
              const eqPromise = Promise.resolve({ data: filtered, error: null });
              
              return Object.assign(eqPromise, {
                single: () => Promise.resolve({ 
                  data: filtered.length > 0 ? filtered[0] : null, 
                  error: null 
                }),
                order: () => Promise.resolve({ data: filtered, error: null })
              });
            },
            in: (column: string, values: any[]) => {
              const filtered = data.filter((item: any) => values.includes(item[column]));
              return Promise.resolve({ data: filtered, error: null });
            },
            order: (_column: string, _options: any = {}) => {
              return Promise.resolve({ data, error: null });
            },
            single: () => Promise.resolve({ 
              data: data.length > 0 ? data[0] : null, 
              error: null 
            })
          });
        },
        insert: (newData: any) => {
          const insertPromise = Promise.resolve({ data: newData, error: null });
          
          return Object.assign(insertPromise, {
            select: () => ({
              single: () => Promise.resolve({ 
                data: Array.isArray(newData) ? newData[0] : newData, 
                error: null 
              })
            })
          });
        },
        update: (updateData: any) => {
          const updatePromise = Promise.resolve({ data: updateData, error: null });
          
          return Object.assign(updatePromise, {
            eq: (_column: string, _value: any) => Promise.resolve({ 
              data: updateData, 
              error: null 
            })
          });
        },
        delete: () => {
          const deletePromise = Promise.resolve({ data: null, error: null });
          
          return Object.assign(deletePromise, {
            eq: (_column: string, _value: any) => Promise.resolve({ 
              data: null, 
              error: null 
            }),
            in: (_column: string, _values: any[]) => Promise.resolve({ 
              data: null, 
              error: null 
            })
          });
        }
      };
    }
  };
};

let supabaseClient;
try {
  if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Invalid or missing Supabase environment variables. Using mock data instead.');
    supabaseClient = createMockClient();
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabaseClient = createMockClient();
}

export const supabase = supabaseClient;
