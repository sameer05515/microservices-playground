'use client'

import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403 Forbidden</h1>
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this resource.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  )
}

