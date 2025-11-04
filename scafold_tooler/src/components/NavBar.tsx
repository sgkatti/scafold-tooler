import React, { useState, useEffect } from 'react'

const NavBar: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.theme === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      root.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [dark])

  return (
    <header className="bg-white dark:bg-gray-800/60 backdrop-blur sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Sanjeev's Optical Toolkit</h2>
        </div>

        <div className="flex items-center gap-3">
          <input
            aria-label="Search tools"
            placeholder="Search tools..."
            className="hidden sm:inline-block bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm focus:outline-none"
          />

          <button
            onClick={() => setDark((d) => !d)}
            className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default NavBar
