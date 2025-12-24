'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin')
          break
        case 'MANAGER':
          router.push('/dashboard/manager')
          break
        case 'USER':
          router.push('/dashboard/user')
          break
        default:
          router.push('/unauthorized')
      }
    }
  }, [user, router])

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Redirecting...</h1>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

