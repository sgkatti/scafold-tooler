import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ToolCard from '../components/ToolCard'
import tools from '../data/tools.json'

const Home: React.FC = () => {
  const [filter, setFilter] = useState<string>('All')
  const categories = useMemo(() => ['All', ...Array.from(new Set(tools.map((t: any) => t.category).filter(Boolean)))], [])

  const visible = useMemo(() => (filter === 'All' ? tools : tools.filter((t: any) => t.category === filter)), [filter])

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <section className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome to Sanjeev's Optical Toolkit</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">A compact hub for your optical/engineering tools.</p>
        </div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded ${filter === c ? 'bg-teal-600 text-white' : 'bg-white dark:bg-gray-800'}`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t: any) => (
            <Link to={`/tool/${t.id}`} key={t.id}>
              <ToolCard tool={t} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
