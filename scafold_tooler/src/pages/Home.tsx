import React from 'react'
import { Link } from 'react-router-dom'
import ToolCard from '../components/ToolCard'
import tools from '../data/tools.json'

const Home: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Welcome to Sanjeev's Optical Toolkit</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">A compact hub for your optical/engineering tools.</p>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t) => (
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
