import React, { useState } from 'react'
import { motion } from 'framer-motion'

type Route = { dest: string; nextHop: string; metric?: number }

const example = `[
  {"dest":"10.0.0.0/24","nextHop":"R1","metric":1},
  {"dest":"10.0.0.0/24","nextHop":"R2","metric":10},
  {"dest":"10.0.1.0/24","nextHop":"R3","metric":5}
]`

const StaticRouteVisualizer: React.FC = () => {
  const [text, setText] = useState(example)
  const [routes, setRoutes] = useState<Route[]>(JSON.parse(example))
  const [queryDest, setQueryDest] = useState<string>('')
  const [selected, setSelected] = useState<Route | null>(null)

  const run = () => {
    try {
      const parsed = JSON.parse(text) as Route[]
      setRoutes(parsed)
    } catch (e) {
      // ignore
    }
  }

  const lookup = () => {
    const matches = routes.filter((r) => r.dest === queryDest)
    if (!matches.length) {
      setSelected(null)
      return
    }
    // choose lowest metric as preferred
    matches.sort((a, b) => (a.metric ?? 0) - (b.metric ?? 0))
    setSelected(matches[0])
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600">Static routes JSON</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full mt-2 p-2 rounded border bg-white dark:bg-gray-800"></textarea>
        <div className="mt-2 flex gap-2">
          <button onClick={run} className="px-4 py-2 bg-teal-500 text-white rounded">Load</button>
          <input value={queryDest} onChange={(e) => setQueryDest(e.target.value)} placeholder="Enter dest to inspect" className="px-3 py-2 rounded border" />
          <button onClick={lookup} className="px-4 py-2 bg-blue-600 text-white rounded">Lookup</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Route Table</h4>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-gray-500"><th>Dest</th><th>Next hop</th><th>Metric</th></tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={i} className={`border-t ${selected && selected.dest === r.dest && selected.nextHop === r.nextHop ? 'bg-teal-50' : ''}`}><td className="py-1">{r.dest}</td><td>{r.nextHop}</td><td>{r.metric}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <h5 className="font-medium">Lookup result</h5>
          {selected ? (
            <div className="text-sm mt-2">Preferred: {selected.nextHop} (metric {selected.metric}) — Fallbacks: {routes.filter(r=>r.dest===selected.dest && r.nextHop!==selected.nextHop).map(r=>r.nextHop).join(', ') || 'none'}</div>
          ) : (
            <div className="text-sm mt-2 text-gray-500">Enter a destination and click Lookup to see preference</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default StaticRouteVisualizer
