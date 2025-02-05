import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
export class Role {
  name: string;
  permissions: Set<string>;

  constructor(name: string, permissions: string[]) {
    this.name = name;
    this.permissions = new Set(permissions);
  }

  hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }
}

export class User {
  id: string;
  email: string;
  role: Role;

  constructor(id: string, email: string, role: Role) {
    this.id = id;
    this.email = email;
    this.role = role;
  }

  hasPermission(permission: string): boolean {
    return this.role.hasPermission(permission);
  }
}

export interface AuthRequest extends Request {
  user?: any; // To store user data from JWT
}

export const authorize = (requiredPermission: string) => (req: AuthRequest, res: Response, next: NextFunction) => {
  const user: User | undefined = req.user as User; // Assuming user is added to request after authentication

  if (!user) {
    res.status(401).json({ message: "Unauthorized: No user found" });
    return;
  }

  if (!user.hasPermission(requiredPermission)) {
    res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    return;
  }

  next();
};

// Define roles with their respective permissions
export const roles: Record<string, Role> = {
  ADMIN: new Role("admin", ["create", "read", "update", "delete"]),
  USER: new Role("user", ["read"]),
};

//===================
const protectedRoutes = express.Router();

protectedRoutes.get("/admin-data", authorize("delete"), (req, res) => {
  res.json({ message: "Welcome, Admin! You have delete access." });
});

protectedRoutes.get("/user-data", authorize("read"), (req, res) => {
  res.json({ message: "Welcome, User! You have read access." });
});

// export default router;

//--------------------====================

//==========================

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRY = "1h"; // 1 hour expiration for demo

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
    req.user = new User(decoded.id, decoded.email, roles[decoded.role.toUpperCase()]);
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

//=======================

dotenv.config();

const app = express();
const port = 3005;

app.use(express.json());

app.post("/api/v11/auth/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  // Assign role based on email pattern
  const role = email.startsWith("admin") ? "admin" : "user";

  // Generate JWT Token
  const token = jwt.sign({ id: "dummy-user-id", email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

  res.json({ message: "Login successful", token });
});

// Apply authentication before role-based routes
app.use("/api/v11/protected", authenticateUser, protectedRoutes);


// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
