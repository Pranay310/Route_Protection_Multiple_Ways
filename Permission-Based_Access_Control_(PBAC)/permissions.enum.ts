// src/auth/permissions.enum.ts

// Define the complete list of atomic permissions your system supports.
// Atomic means: smallest indivisible access right.
// These can be assigned to roles or directly to users.
export enum Permission {
  CREATE_USER = 'CREATE_USER',     // Allows creating new users
  UPDATE_USER = 'UPDATE_USER',     // Allows editing existing users
  DELETE_USER = 'DELETE_USER',     // Allows deleting users
  READ_USER = 'READ_USER',         // Allows reading user profile/list

  CREATE_TASK = 'CREATE_TASK',     // Example: task management
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  READ_TASK = 'READ_TASK',

  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD', // Example: limited admin access
}
