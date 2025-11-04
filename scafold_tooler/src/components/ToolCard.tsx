import React from 'react'
import { motion } from 'framer-motion'

type Tool = {
  id: string
  title: string
  description: string
  icon: string
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
          <h3 className="text-lg font-medium">{tool.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tool.description}</p>
        </div>
      </div>
    </motion.article>
  )
}

export default ToolCard
