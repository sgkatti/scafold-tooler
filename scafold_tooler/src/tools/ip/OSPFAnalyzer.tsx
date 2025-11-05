import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { parseOSPF, dijkstraCost } from '../../lib/algorithms'

const example = `LSA: R1 -> R2 cost=10
LSA: R2 -> R3 cost=5
LSA: R2 -> R4 cost=20
LSA: R4 -> R5 cost=3`

const OSPFAnalyzer: React.FC = () => {
  const [txt, setTxt] = useState(example)
  const [parsed, setParsed] = useState(() => parseOSPF(example))
  const [srcNode, setSrcNode] = useState<string | null>(null)
  const [dstNode, setDstNode] = useState<string | null>(null)
  const [pathRes, setPathRes] = useState<any>(null)

  const run = () => {
    const p = parseOSPF(txt)
    setParsed(p)
    setSrcNode(p.nodes[0] || null)
    setDstNode(p.nodes[1] || null)
    setPathRes(null)
  }

  const computePath = () => {
    if (!srcNode || !dstNode) return
    const res = dijkstraCost(parsed.nodes, parsed.links, srcNode, dstNode)
    setPathRes(res)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
  <label className="block text-sm text-gray-600">{'Paste show ip ospf database style text (demo format: "LSA: A -> B cost=10")'}</label>
        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={6} className="w-full mt-2 p-2 rounded border bg-white dark:bg-gray-800"></textarea>
        <div className="mt-2 flex gap-2">
          <button onClick={run} className="px-4 py-2 bg-teal-500 text-white rounded">Analyze</button>
          <button onClick={computePath} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={!parsed.nodes.length}>Compute shortest path</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Parsed Topology</h4>
        <p className="text-sm mt-2">Nodes: {parsed.nodes.join(', ')}</p>
        <div className="mt-2">
          <h5 className="text-sm font-medium">Links</h5>
          <ul className="list-disc ml-5 mt-1 text-sm">
            {parsed.links.map((l, i) => (
              <li key={i}>{l.a} → {l.b} (cost: {l.cost})</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600">Source</label>
          <select value={srcNode ?? ''} onChange={(e) => setSrcNode(e.target.value)} className="mt-1 px-3 py-2 rounded border">
            <option value="">--</option>
            {parsed.nodes.map((n: string) => <option key={n} value={n}>{n}</option>)}
          </select>

          <label className="block text-sm text-gray-600 mt-2">Destination</label>
          <select value={dstNode ?? ''} onChange={(e) => setDstNode(e.target.value)} className="mt-1 px-3 py-2 rounded border">
            <option value="">--</option>
            {parsed.nodes.map((n: string) => <option key={n} value={n}>{n}</option>)}
          </select>

          {pathRes ? (
            <div className="mt-3 text-sm">
              <p>Shortest path by cost: {pathRes.path.join(' → ')}</p>
              <p>Total cost: {pathRes.cost}</p>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

export default OSPFAnalyzer
