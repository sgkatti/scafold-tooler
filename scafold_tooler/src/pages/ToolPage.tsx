import React, { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import tools from '../data/tools.json'
const OpticalPathPlanner = React.lazy(() => import('../tools/optical/OpticalPathPlanner'))
const PMDataVisualizer = React.lazy(() => import('../tools/optical/PMDataVisualizer'))
const TapiYangGenerator = React.lazy(() => import('../tools/optical/TapiYangGenerator'))
const OSPFAnalyzer = React.lazy(() => import('../tools/ip/OSPFAnalyzer'))
const StaticRouteVisualizer = React.lazy(() => import('../tools/ip/StaticRouteVisualizer'))
const SubmarineSpanCalculator = React.lazy(() => import('../tools/submarine/SubmarineSpanCalculator'))
const FiberOsnrEstimator = React.lazy(() => import('../tools/submarine/FiberOsnrEstimator'))

const ToolPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const tool = tools.find((t) => t.id === id)

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold">Tool not found</h2>
        <p className="mt-4">We couldn't find the requested tool.</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">Back to hub</Link>
      </div>
    )
  }

  const renderTool = () => {
    switch (tool.id) {
      case 'optical-path-planner':
        return <OpticalPathPlanner />
      case 'pm-data-visualizer':
        return <PMDataVisualizer />
      case 'tapi-yang-generator':
        return <TapiYangGenerator />
      case 'ospf-analyzer':
        return <OSPFAnalyzer />
      case 'static-route-visualizer':
        return <StaticRouteVisualizer />
      case 'submarine-span-calculator':
        return <SubmarineSpanCalculator />
      case 'fiber-osnr-estimator':
        return <FiberOsnrEstimator />
      default:
        return <p>Tool not yet implemented.</p>
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{tool.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{tool.description}</p>
        </div>
        <div>
          <Link to="/" className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700">Back to dashboard</Link>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <Suspense fallback={<div className="p-6 text-center">Loading tool…</div>}>
          {renderTool()}
        </Suspense>
      </section>
    </main>
  )
}

export default ToolPage
