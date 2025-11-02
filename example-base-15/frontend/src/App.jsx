function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Frontend
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              React + Vite + Tailwind CSS
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md">
              <span className="text-sm font-medium text-gray-700">
                ✨ Tailwind CSS is working!
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vite
              </h3>
              <p className="text-gray-600">
                Fast build tool and dev server
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-3">⚛️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                React
              </h3>
              <p className="text-gray-600">
                Modern UI library for building interfaces
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tailwind CSS
              </h3>
              <p className="text-gray-600">
                Utility-first CSS framework
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

