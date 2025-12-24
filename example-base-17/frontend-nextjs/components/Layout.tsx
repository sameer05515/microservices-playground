'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800'
      case 'USER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">RBAC Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">{user.username}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

