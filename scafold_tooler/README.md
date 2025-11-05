# Sanjeev's Optical Toolkit — Tool Hub

A responsive, modern web dashboard to host and link to your personal tools.

Features
- React + Vite + TypeScript
- Tailwind CSS for styling
- Framer Motion for smooth animations
- Dynamic cards populated from `tools.json`
- React Router routes for each tool page
- Dark/light theme toggle (built-in)

Quick start

1. Install dependencies

```powershell
cd path\to\scafold_tooler
npm install
```

2. Run dev server

```powershell
npm run dev
```

3. Build

```powershell
npm run build
npm run preview
```

Notes
- Deploy to Vercel or GitHub Pages by building the project and following the host's deployment guide.
- See `src/data/tools.json` for example cards. Add your tools there.

New in this branch
- Added fully client-side implementations (demo/mock) of multiple engineering tools under `src/tools/`:
	- `optical`: Optical Path Planner, PM Data Visualizer, TAPI/YANG Generator
	- `ip`: OSPF Path Analyzer, Static Route Visualizer
	- `submarine`: Submarine Span Calculator, Fiber OSNR Budget Estimator
- Tools are wired into routing via `/tool/:id` and listed on the dashboard. Use category buttons to filter.

How to run locally in Codespaces
1. npm install
2. npm run dev
Open http://localhost:5173/ in the preview or browser.

Notes and next steps
- The tool implementations are intentionally lightweight and use mock data. They are good starting points for connecting real data or expanding algorithms.
- If you want, I can add unit tests, TypeScript types for the tool inputs/outputs, or more detailed graphs with a charting library.

Stretch goals included as placeholders: analytics hooks, PWA config.
