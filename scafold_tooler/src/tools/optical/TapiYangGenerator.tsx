import React, { useState } from 'react'
import { motion } from 'framer-motion'

const sampleJSON = `{
  "nodes": [
    {"id":"A","label":"Node A"},
    {"id":"B","label":"Node B"}
  ],
  "links": [{"a":"A","b":"B","length_km":100}]
}`

const TapiYangGenerator: React.FC = () => {
  const [text, setText] = useState(sampleJSON)
  const [out, setOut] = useState('')

  const gen = () => {
    try {
      const obj = JSON.parse(text)
      const model = {
        tapi: {
          topology: {
            nodes: obj.nodes,
            links: obj.links
          }
        }
      }
      setOut(JSON.stringify(model, null, 2))
    } catch (e) {
      setOut('// invalid JSON')
    }
  }

  const download = () => {
    const blob = new Blob([out], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tapi_model.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600">Nodes/Links JSON</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full mt-2 p-2 rounded border bg-white dark:bg-gray-800"></textarea>
        <div className="mt-2 flex gap-2">
          <button onClick={gen} className="px-4 py-2 bg-teal-500 text-white rounded">Generate</button>
          <button onClick={download} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={!out}>Download JSON</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Generated TAPI / YANG snippet</h4>
        <pre className="mt-2 text-sm overflow-auto max-h-64 bg-gray-50 dark:bg-gray-900 p-2 rounded">{out || '// result will appear here'}</pre>
      </div>
    </motion.div>
  )
}

export default TapiYangGenerator
