src/
│── components/
│   ├── RBACWrapper.tsx   <-- HOC to wrap protected components
│   ├── Dashboard.tsx      <-- Example protected component
│── hooks/
│   ├── useAuth.ts         <-- Hook to get user & role
│── pages/
│   ├── Home.tsx
│   ├── AdminPage.tsx      <-- Only Admin can access
│── routes/
│   ├── AppRoutes.tsx      <-- Defines routes & protection
│── App.tsx
│── main.tsx
