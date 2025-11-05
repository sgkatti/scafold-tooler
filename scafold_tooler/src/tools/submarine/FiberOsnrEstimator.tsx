import React, { useState } from 'react'
import { motion } from 'framer-motion'

const FiberOsnrEstimator: React.FC = () => {
  const [launch, setLaunch] = useState(-3)
  const [nf, setNf] = useState(5)
  const [spans, setSpans] = useState(4)
  const [bandwidthHz, setBandwidthHz] = useState(12.5e9) // 12.5 GHz channel

  const compute = () => {
    // Approximate OSNR calculation (very simplified):
    // For cascaded amplifiers, noise roughly accumulates proportionally to NF and number of amps.
    const amps = Math.max(1, spans)
    const totalNf = nf * amps
    // Convert bandwidth to dB-Hz: 10*log10(B)
    const bwDb = 10 * Math.log10(bandwidthHz)
    // Use a simple model: OSNR_rx_dB = launch - totalNf - (bwDb - 3)  (3 dB reference)
    const osnr = launch - totalNf - (bwDb - 3)
    return { osnr: osnr.toFixed(2), amps }
  }

  const res = compute()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Launch power (dBm)</label>
          <input type="number" value={launch} onChange={(e) => setLaunch(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Amplifier NF (dB)</label>
          <input type="number" value={nf} onChange={(e) => setNf(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Span count</label>
          <input type="number" value={spans} onChange={(e) => setSpans(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Estimated OSNR at receiver</h4>
        <p className="text-sm mt-2">Estimated amps: {res.amps}</p>
        <p className="text-sm">OSNR_rx (mock): {res.osnr} dB</p>
        {Number(res.osnr) < 18 ? <p className="text-sm text-red-500">Warning: OSNR below 18 dB threshold</p> : <p className="text-sm text-green-600">OSNR appears acceptable</p>}
      </div>
    </motion.div>
  )
}

export default FiberOsnrEstimator
