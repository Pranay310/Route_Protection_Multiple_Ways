// src/auth/roles.enum.ts

// Define the finite set of roles your application recognizes.
// Using an enum gives type-safety and autocompletion.
export enum Role {
  USER = 'USER',          // baseline user permissions
  MANAGER = 'MANAGER',    // elevated permissions for team/feature ownership
  ADMIN = 'ADMIN',        // full access; use sparingly
}
