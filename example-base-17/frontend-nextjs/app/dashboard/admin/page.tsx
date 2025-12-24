'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import { adminApi } from '@/lib/api'

interface User {
  _id: string
  id: string
  username: string
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState('USER')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getUsers()
      setUsers(data.users || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    try {
      await adminApi.updateUserRole(selectedUser._id || selectedUser.id, newRole)
      await loadUsers()
      setShowRoleModal(false)
      setSelectedUser(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await adminApi.deleteUser(userId)
      await loadUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user')
    }
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
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Manage all users and system resources</p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Users</h2>
              {loading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id || user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setNewRole(user.role)
                                setShowRoleModal(true)
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id || user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Update Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Role for {selectedUser.username}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

