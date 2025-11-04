import React from 'react'
import { useParams, Link } from 'react-router-dom'
import tools from '../data/tools.json'

const ToolPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const tool = tools.find((t) => t.id === id)

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold">Tool not found</h2>
        <p className="mt-4">We couldn't find the requested tool.</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">Back to hub</Link>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">{tool.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{tool.description}</p>
      </header>

      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <p>This is a placeholder page for the tool. You can embed your app here or link out.</p>
        <div className="mt-4">
          <a href={tool.link} target="_blank" rel="noreferrer" className="text-blue-600">Open external tool</a>
        </div>
      </section>
    </main>
  )
}

export default ToolPage
