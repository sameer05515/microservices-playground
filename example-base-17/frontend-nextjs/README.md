# Frontend - Example Base 17 (Next.js RBAC)

This is the Next.js frontend for **Example Base 17** — a modern React application with Role-Based Access Control (RBAC) that integrates with the Node.js backend API.

---

## 🚀 Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **Backend API** running on `http://localhost:3000` (see `../backend/README.md`)

---

## ⚙️ Configuration

1. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ Running the Frontend

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000` (Next.js default port is 3000, but you can change it if it conflicts with your backend).

### Production Build
```bash
npm run build
npm start
```

---

## 🎯 Features

### Authentication
- ✅ User registration with role selection
- ✅ User login with JWT token
- ✅ Automatic token management (localStorage)
- ✅ Protected routes based on authentication

### Role-Based Access Control
- ✅ **ADMIN** - Full access to all resources
  - View all users
  - Update user roles
  - Delete users
  - Access: `/dashboard/admin`

- ✅ **MANAGER** - Limited resource access
  - View USER accounts only
  - Update USER accounts only
  - Cannot modify ADMIN or MANAGER accounts
  - Access: `/dashboard/manager`

- ✅ **USER** - Self-scope access
  - View own profile
  - Update own profile
  - Change own password
  - Access: `/dashboard/user`

### UI Components
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Role-based navigation
- ✅ Protected route components
- ✅ Modal dialogs for user actions
- ✅ Error and success message handling

---

## 📁 Project Structure

```
frontend-nextjs/
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin dashboard
│   │   ├── manager/
│   │   │   └── page.tsx          # Manager dashboard
│   │   ├── user/
│   │   │   └── page.tsx          # User dashboard
│   │   └── page.tsx              # Dashboard router
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   ├── unauthorized/
│   │   └── page.tsx              # 403 Forbidden page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects)
│   └── globals.css               # Global styles
├── components/
│   ├── Layout.tsx                # Main layout with navigation
│   └── ProtectedRoute.tsx        # Route protection component
├── context/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   └── api.ts                    # API service layer
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🛣️ Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/login` or `/dashboard` |
| `/login` | Public | User login page |
| `/register` | Public | User registration page |
| `/dashboard` | Auth | Redirects to role-specific dashboard |
| `/dashboard/admin` | ADMIN | Admin dashboard with user management |
| `/dashboard/manager` | ADMIN, MANAGER | Manager dashboard with limited user access |
| `/dashboard/user` | All Auth | User profile management |
| `/unauthorized` | All | 403 Forbidden page |

---

## 🔌 API Integration

The frontend integrates with the backend API through the `lib/api.ts` service layer:

### Auth API
- `authApi.register()` - Register new user
- `authApi.login()` - User login
- `authApi.getMe()` - Get current user

### Admin API
- `adminApi.getUsers()` - Get all users
- `adminApi.getUser(id)` - Get user by ID
- `adminApi.updateUserRole(id, role)` - Update user role
- `adminApi.deleteUser(id)` - Delete user
- `adminApi.getDashboard()` - Admin dashboard data

### Manager API
- `managerApi.getUsers()` - Get limited users (USER role only)
- `managerApi.updateUser(id, data)` - Update user (USER only)
- `managerApi.getDashboard()` - Manager dashboard data

### User API
- `userApi.getProfile()` - Get own profile
- `userApi.updateProfile(data)` - Update own profile
- `userApi.changePassword(data)` - Change own password
- `userApi.getDashboard()` - User dashboard data

---

## 🔐 Authentication Flow

1. **Login/Register** → User authenticates via `/login` or `/register`
2. **Token Storage** → JWT token stored in `localStorage`
3. **Protected Routes** → `ProtectedRoute` component validates authentication and role
4. **API Requests** → Axios interceptor adds `Authorization: Bearer <token>` header
5. **Token Expiry** → On 401 response, user is redirected to `/login`

---

## 🎨 UI Features

### Role Badges
- **ADMIN** - Red badge
- **MANAGER** - Blue badge
- **USER** - Green badge

### Navigation
- Top navigation bar with user info and logout
- Role-based dashboard routing
- Automatic redirects based on user role

### Modals
- Edit profile modal
- Change password modal
- Update user role modal (Admin)
- Edit user modal (Manager)

---

## 🧪 Testing

### Test Admin Access
1. Register/Login as ADMIN
2. Navigate to `/dashboard/admin`
3. View all users
4. Change user roles
5. Delete users

### Test Manager Access
1. Register/Login as MANAGER
2. Navigate to `/dashboard/manager`
3. View USER accounts only
4. Try to edit USER account (should work)
5. Try to access `/dashboard/admin` (should redirect to `/unauthorized`)

### Test User Access
1. Register/Login as USER
2. Navigate to `/dashboard/user`
3. View own profile
4. Edit own profile
5. Change own password
6. Try to access `/dashboard/admin` (should redirect to `/unauthorized`)

---

## 🔧 Development

### Adding New Routes
1. Create page in `app/` directory
2. Wrap with `ProtectedRoute` if needed
3. Add role restrictions: `<ProtectedRoute allowedRoles={['ADMIN']}>`

### Adding New API Calls
1. Add function to appropriate API module in `lib/api.ts`
2. Use in components with error handling

### Styling
- Uses Tailwind CSS
- Custom styles in `app/globals.css`
- Responsive design with mobile-first approach

---

## 🐛 Troubleshooting

### API Connection Errors
- Verify backend is running on `http://localhost:3000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Authentication Issues
- Clear `localStorage` and login again
- Check token expiration (24 hours)
- Verify backend JWT_SECRET matches

### Role-Based Access Issues
- Verify user role in backend database
- Check `ProtectedRoute` component role restrictions
- Ensure JWT token contains correct role

---

## 📚 Dependencies

- **next** - React framework
- **react** - UI library
- **react-dom** - React DOM renderer
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **typescript** - Type safety

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Set `NEXT_PUBLIC_API_URL` to your production backend URL:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

---

## 📝 License

ISC

