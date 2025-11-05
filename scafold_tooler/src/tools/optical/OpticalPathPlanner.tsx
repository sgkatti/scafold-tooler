import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Richer mock topology for demo
import topo from '../../data/mock_topology.json'
import { dijkstraDistance } from '../../lib/algorithms'

type Node = { id: string; label: string }
type Link = { a: string; b: string; length_km: number }

// Dijkstra shortest path by distance (km)
// Use shared dijkstraDistance from lib

const OpticalPathPlanner: React.FC = () => {
  const [src, setSrc] = useState<string>(topo.nodes[0].id)
  const [dst, setDst] = useState<string>(topo.nodes[1].id)

  // realistic-ish params
  const [launchDbm, setLaunchDbm] = useState<number>(0) // dBm
  const [lossPerKm, setLossPerKm] = useState<number>(0.22) // dB/km
  const [ampGainDb, setAmpGainDb] = useState<number>(20) // dB per amp
  const [ampNfDb, setAmpNfDb] = useState<number>(4) // dB noise figure per amp
  const [spanKm, setSpanKm] = useState<number>(80)
  const [osnrThreshold, setOsnrThreshold] = useState<number>(18)

  const [result, setResult] = useState<null | { path: string[]; distance: number; amps: number; totalLoss: number; osnrMargin: number }>(null)

  const run = () => {
    const res = dijkstraDistance(topo.nodes, topo.links, src, dst)
    if (!res) {
      setResult(null)
      return
    }

    const distance = res.distance // km
    const amps = Math.max(0, Math.ceil(distance / spanKm) - 1) // repeater count along the route (excluding terminals)
    const totalLoss = distance * lossPerKm

    // Simple OSNR accumulation model (mock): each amplifier adds noise; assume noise floor is -58 dBm
    const noiseFloorDbm = -58
    // total amplifier noise (linear approximation): NF_total_dB ~= 10*log10(sum(10^(NF/10) ...)) but we'll approximate as nf*amps
    const totalNf = ampNfDb * (amps || 1)
    // estimate OSNR margin: launch - (noiseFloor + totalNf + residualLossFactor)
    const residualLossFactor = totalLoss * 0.1 // arbitrary scaling to keep numbers sensible for demo
    const osnrMargin = launchDbm - (noiseFloorDbm + totalNf + residualLossFactor)

    setResult({ path: res.path, distance, amps, totalLoss, osnrMargin })
  }

  // simple circular layout for nodes to render a small network diagram
  const layout = () => {
    const n = topo.nodes.length
    const cx = 260
    const cy = 160
    const r = 100
    const positions: Record<string, { x: number; y: number }> = {}
    topo.nodes.forEach((node: any, i: number) => {
      const ang = (i / n) * Math.PI * 2 - Math.PI / 2
      positions[node.id] = { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r }
    })
    return positions
  }

  const positions = layout()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Source</label>
          <select value={src} onChange={(e) => setSrc(e.target.value)} className="mt-1 px-3 py-2 rounded border w-full">
            {topo.nodes.map((n: any) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Destination</label>
          <select value={dst} onChange={(e) => setDst(e.target.value)} className="mt-1 px-3 py-2 rounded border w-full">
            {topo.nodes.map((n: any) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Launch power (dBm)</label>
          <input type="number" value={launchDbm} onChange={(e) => setLaunchDbm(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Fiber loss (dB/km)</label>
          <input type="number" step="0.01" value={lossPerKm} onChange={(e) => setLossPerKm(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Span length (km)</label>
          <input type="number" value={spanKm} onChange={(e) => setSpanKm(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button onClick={run} className="px-4 py-2 bg-teal-500 text-white rounded">Plan</button>
        <div className="text-sm text-gray-500">OSNR threshold (dB): <input type="number" value={osnrThreshold} onChange={(e) => setOsnrThreshold(Number(e.target.value))} className="ml-2 w-20 p-1 rounded border" /></div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold">Suggested Path</h3>
        {!result ? (
          <p className="text-sm text-gray-500 mt-2">No path planned yet — click Plan.</p>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-sm">Path: {result.path.join(' → ')}</p>
            <p className="text-sm">Distance: {result.distance.toFixed(1)} km</p>
            <p className="text-sm">Amplifiers (approx): {result.amps}</p>
            <p className="text-sm">Total fiber loss: {result.totalLoss.toFixed(2)} dB</p>
            <p className={`text-sm ${result.osnrMargin < osnrThreshold ? 'text-red-500' : 'text-teal-500'}`}>Estimated OSNR margin (mock): {result.osnrMargin.toFixed(2)} dB</p>
            <p className="text-sm">Regen required: {result.osnrMargin < osnrThreshold ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
      {/* simple network diagram */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
        <h4 className="font-medium mb-2">Network diagram (mock)</h4>
        <svg width={520} height={320} className="mx-auto">
          {/* links */}
          {topo.links.map((l: any, i: number) => {
            const a = positions[l.a]
            const b = positions[l.b]
            const inPath = result && result.path && result.path.some((_, idx) => result.path[idx] === l.a && result.path[idx+1] === l.b) || (result && result.path && result.path.some((_, idx) => result.path[idx] === l.b && result.path[idx+1] === l.a))
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={inPath ? '#06b6d4' : '#cbd5e1'} strokeWidth={inPath ? 3 : 1.5} />
                <text x={(a.x+b.x)/2} y={(a.y+b.y)/2 - 6} fontSize={10} fill="#475569">{l.length_km} km</text>
              </g>
            )
          })}

          {/* nodes */}
          {topo.nodes.map((n: any, i: number) => (
            <g key={n.id}>
              <circle cx={positions[n.id].x} cy={positions[n.id].y} r={18} fill="#ffffff" stroke="#0ea5a4" />
              <text x={positions[n.id].x} y={positions[n.id].y + 4} fontSize={10} textAnchor="middle">{n.id}</text>
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  )
}

export default OpticalPathPlanner
