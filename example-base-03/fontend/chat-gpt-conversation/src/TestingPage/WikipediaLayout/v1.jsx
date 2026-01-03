import React from "react";

export default function WikipediaLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Wikipedia</h1>
        <input
          type="text"
          placeholder="Search Wikipedia"
          className="border rounded px-3 py-1 w-64 bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-colors"
        />
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6">
        
        {/* Left Sidebar */}
        <aside className="hidden md:block col-span-3">
          <div className="sticky top-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
            <h2 className="font-semibold mb-2">Contents</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#history" className="text-blue-600 dark:text-blue-400">
                  History
                </a>
              </li>
              <li>
                <a href="#features" className="text-blue-600 dark:text-blue-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-blue-600 dark:text-blue-400">
                  Architecture
                </a>
              </li>
              <li>
                <a href="#references" className="text-blue-600 dark:text-blue-400">
                  References
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-6">
          <article className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded p-6">
            <h1 className="text-3xl font-bold mb-4">React (JavaScript library)</h1>

            <section id="history" className="mb-6">
              <h2 className="text-2xl font-semibold border-b dark:border-gray-700 pb-1 mb-2">
                History
              </h2>
              <p>
                React is a free and open-source front-end JavaScript library
                for building user interfaces based on components.
              </p>
            </section>

            <section id="features" className="mb-6">
              <h2 className="text-2xl font-semibold border-b dark:border-gray-700 pb-1 mb-2">
                Features
              </h2>
              <ul className="list-disc pl-6">
                <li>Component Based</li>
                <li>Virtual DOM</li>
                <li>Declarative UI</li>
                <li>Reusable Components</li>
              </ul>
            </section>

            <section id="architecture">
              <h2 className="text-2xl font-semibold border-b dark:border-gray-700 pb-1 mb-2">
                Architecture
              </h2>
              <p>
                React follows a component-based architecture where UI is broken
                into reusable pieces.
              </p>
            </section>
          </article>
        </main>

        {/* Right Infobox */}
        <aside className="col-span-12 md:col-span-3">
          <div className="border rounded p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold mb-2">React</h3>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              alt="React"
              className="w-20 mx-auto mb-2"
            />
            <table className="text-sm w-full">
              <tbody>
                <tr>
                  <td className="font-medium">Developer</td>
                  <td>Meta</td>
                </tr>
                <tr>
                  <td className="font-medium">Released</td>
                  <td>2013</td>
                </tr>
                <tr>
                  <td className="font-medium">Type</td>
                  <td>JavaScript Library</td>
                </tr>
              </tbody>
            </table>
          </div>
        </aside>

      </div>
    </div>
  );
}