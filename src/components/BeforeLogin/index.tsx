import React from 'react'
import { AdminLoginForm } from '../AdminLoginForm'

const BeforeLogin: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address to receive a passwordless login link
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}

export default BeforeLogin
