import React, { useState } from 'react'
import { motion } from 'framer-motion'

const SubmarineSpanCalculator: React.FC = () => {
  const [lengthM, setLengthM] = useState(10000)
  const [spacingKm, setSpacingKm] = useState(80)
  const [lossPerKm, setLossPerKm] = useState(0.22)
  const [ampGainDb, setAmpGainDb] = useState(20)
  const [ampNfDb, setAmpNfDb] = useState(4)
  const [launchDbm, setLaunchDbm] = useState(0)

  const compute = () => {
    const lengthKm = lengthM / 1000
    const spans = Math.ceil(lengthKm / spacingKm)
    const amps = Math.max(0, spans - 1)
    const perSpanLoss = spacingKm * lossPerKm
    const totalLoss = lengthKm * lossPerKm

    // Signal restoration: assume each amp restores span loss but adds NF; noise accumulates roughly as NF_total
    const totalNf = ampNfDb * (amps || 1)
    // approximate OSNR at receiver (very simplified): launch - totalNf - perSpanLoss*0.2 - 10*log10(spans)
    const osnrRx = launchDbm - totalNf - perSpanLoss * 0.2 - 10 * Math.log10(Math.max(1, spans))

    return { spans, amps, totalLoss: totalLoss.toFixed(2), osnrRx: osnrRx.toFixed(2) }
  }

  const res = compute()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Cable length (m)</label>
          <input type="number" value={lengthM} onChange={(e) => setLengthM(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Repeater spacing (km)</label>
          <input type="number" value={spacingKm} onChange={(e) => setSpacingKm(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Fiber loss (dB/km)</label>
          <input type="number" step="0.01" value={lossPerKm} onChange={(e) => setLossPerKm(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Amp gain (dB)</label>
          <input type="number" value={ampGainDb} onChange={(e) => setAmpGainDb(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Amp NF (dB)</label>
          <input type="number" value={ampNfDb} onChange={(e) => setAmpNfDb(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Launch power (dBm)</label>
          <input type="number" value={launchDbm} onChange={(e) => setLaunchDbm(Number(e.target.value))} className="mt-1 p-2 rounded border w-full" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Results</h4>
        <p className="text-sm mt-2">Cable spans: {res.spans}</p>
        <p className="text-sm">Amplifier count: {res.amps}</p>
        <p className="text-sm">Total fiber loss (dB): {res.totalLoss}</p>
        <p className="text-sm">Estimated OSNR at receiver (mock): {res.osnrRx} dB</p>
      </div>
    </motion.div>
  )
}

export default SubmarineSpanCalculator
