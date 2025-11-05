import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

type ChartRow = { index: number; time: string; preFecLog: number | null; osnr: number | null; power: number | null }

type Props = {
  data: ChartRow[]
  alerts: Array<{ badBer: boolean; badOsnr: boolean }>
  osnrThreshold: number
}

const PMDataChart: React.FC<Props> = ({ data, alerts, osnrThreshold }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Pre-FEC BER (−log10)</h4>
        <div style={{ width: '100%', height: 140 }}>
          <ResponsiveContainer>
            <LineChart data={data as any}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="preFecLog" stroke="#0ea5a4" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm">
          {alerts.some((a) => a.badBer) ? <span className="text-red-500">Warning: BER above threshold on some samples</span> : <span className="text-green-600">BER within threshold</span>}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">OSNR (dB)</h4>
        <div style={{ width: '100%', height: 140 }}>
          <ResponsiveContainer>
            <LineChart data={data as any}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="osnr" stroke="#60a5fa" strokeWidth={2} dot={{ r: 2 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm">
          {alerts.some((a) => a.badOsnr) ? <span className="text-red-500">Alert: OSNR below {osnrThreshold} dB on some samples</span> : <span className="text-green-600">OSNR OK</span>}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h4 className="font-medium">Power (dBm)</h4>
        <div style={{ width: '100%', height: 140 }}>
          <ResponsiveContainer>
            <LineChart data={data as any}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="power" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PMDataChart
