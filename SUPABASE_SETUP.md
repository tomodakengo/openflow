# Supabase Integration Setup

This document provides instructions for setting up Supabase integration with the OpenFlow application.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project

## Environment Setup

1. Create a `.env` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Database Setup

1. Go to the SQL Editor in your Supabase project
2. Run the SQL commands in the `supabase_setup.sql` file to create the necessary tables and relationships

## Authentication Setup

1. Go to Authentication > Settings in your Supabase project
2. Configure the following settings:
   - Site URL: Set to your application URL (e.g., http://localhost:5173 for local development)
   - Redirect URLs: Add your application URL (e.g., http://localhost:5173/*)
3. Enable Email/Password sign-in method

## Row Level Security (RLS) Policies

The SQL setup script includes basic Row Level Security policies. For production use, you should review and potentially enhance these policies:

```sql
-- Allow users to read all users
CREATE POLICY "Users can view all users" ON users
FOR SELECT USING (true);

-- Allow users to update only their own user data
CREATE POLICY "Users can update own user data" ON users
FOR UPDATE USING (auth.uid() = id);

-- Allow users to view all teams
CREATE POLICY "Users can view all teams" ON teams
FOR SELECT USING (true);

-- Allow users to view all workflows
CREATE POLICY "Users can view all workflows" ON workflows
FOR SELECT USING (true);

-- Allow users to update workflows they created
CREATE POLICY "Users can update own workflows" ON workflows
FOR UPDATE USING (true); -- In production, this should be restricted to the creator
```

## Data Models

The Supabase integration uses the following data models:

1. **Users**: User accounts and profile information
2. **Teams**: Team organization with hierarchical structure
3. **Team Members**: Many-to-many relationship between users and teams
4. **Workflows**: Workflow definitions with steps and connections
5. **Forms**: Form definitions with fields and validation
6. **Tasks**: Task assignments with status, priority, and dependencies

## Testing

1. Start the application with `npm run dev`
2. Register a new user
3. Verify that data is being saved to Supabase by checking the Tables view in your Supabase dashboard
4. Test the following functionality:
   - User registration and login
   - Creating and editing workflows
   - Creating and submitting forms
   - Creating and managing tasks
   - Team management and user assignments

## Troubleshooting

1. **Authentication Issues**:
   - Check that your environment variables are correctly set
   - Verify that the site URL and redirect URLs are configured correctly
   - Check browser console for any errors

2. **Database Issues**:
   - Verify that all tables were created successfully
   - Check that RLS policies are not blocking legitimate requests
   - Review the SQL logs in the Supabase dashboard

3. **API Issues**:
   - Confirm that your Supabase anon key has the necessary permissions
   - Check network requests in browser developer tools
   - Verify that your Supabase project is active and not in maintenance mode
