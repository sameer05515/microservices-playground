export type Role = "admin" | "user" | "editor";

export interface User {
  id: number;
  email: string;
  password: string; // Plain text for simplicity (DO NOT USE in real apps)
  role: Role;
}

export const users: User[] = [
  { id: 1, email: "admin@example.com", password: "Pass@123", role: "admin" },
  { id: 2, email: "user@example.com", password: "Pass@123", role: "user" },
  { id: 3, email: "editor@example.com", password: "Pass@123", role: "editor" },
];
