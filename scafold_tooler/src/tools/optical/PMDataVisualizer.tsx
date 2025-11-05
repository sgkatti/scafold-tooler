import React, { useState, Suspense } from 'react'
import { motion } from 'framer-motion'

const PMDataChart = React.lazy(() => import('./PMDataChart'))

type Row = { time?: string; preFec?: number; osnr?: number; cd?: number; power?: number }

const parseCSV = (text: string): Row[] => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((l) => {
    const cols = l.split(',')
    const obj: any = {}
    headers.forEach((h, i) => {
      obj[h] = isNaN(Number(cols[i])) ? cols[i] : Number(cols[i])
    })
    return obj as Row
  })
}

const exampleCSV = `time,preFec,osnr,cd,power
0,1e-3,24,0.1,-3
1,5e-4,25,0.12,-2.8
2,2e-4,26,0.11,-2.5
3,1.2e-4,27,0.09,-2.2
4,1e-4,27.5,0.08,-2.1`

const PMDataVisualizer: React.FC = () => {
  const [csv, setCsv] = useState(exampleCSV)
  const [rows, setRows] = useState<Row[]>(parseCSV(exampleCSV))

  const run = () => {
    try {
      const parsed = parseCSV(csv)
      setRows(parsed)
    } catch (e) {
      // ignore
    }
  }

  // derive plotting arrays and alerts
  const osnrThreshold = 18
  const berThreshold = 1e-3
  const alerts = rows.map((r) => ({
    badBer: (r.preFec ?? 0) > berThreshold,
    badOsnr: (r.osnr ?? 0) < osnrThreshold
  }))

  const chartData = rows.map((r, i) => ({
    index: i,
    time: r.time ?? String(i),
    preFecLog: r.preFec ? -Math.log10(r.preFec) : null,
    osnr: r.osnr ?? null,
    power: r.power ?? null
  }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600">Paste CSV (time,preFec,osnr,cd,power)</label>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} className="w-full mt-2 p-2 rounded border bg-white dark:bg-gray-800"></textarea>
        <div className="mt-2">
          <button onClick={run} className="px-4 py-2 bg-teal-500 text-white rounded">Render</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Suspense fallback={<div className="p-4 text-center">Loading charts…</div>}>
          <PMDataChart data={chartData as any} alerts={alerts} osnrThreshold={osnrThreshold} />
        </Suspense>
      </div>
    </motion.div>
  )
}

export default PMDataVisualizer
