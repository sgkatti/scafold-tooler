import React from 'react'
import { motion } from 'framer-motion'

type Tool = {
  id: string
  title: string
  description: string
  icon: string
  category?: string
  link?: string
}

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <img src={tool.icon} alt="" className="w-12 h-12 rounded-md" />
        <div>
          {tool.category ? <div className="text-xs inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded mb-1">{tool.category}</div> : null}
          <h3 className="text-lg font-medium">{tool.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tool.description}</p>
        </div>
      </div>
    </motion.article>
  )
}

export default ToolCard
