export type Node = { id: string; label?: string }
export type Link = { a: string; b: string; length_km?: number; cost?: number }

// Dijkstra by distance (length_km)
export function dijkstraDistance(nodes: Node[], links: Link[], src: string, dst: string) {
  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const q = new Set<string>(nodes.map((n) => n.id))
  nodes.forEach((n) => {
    dist[n.id] = Infinity
    prev[n.id] = null
  })
  dist[src] = 0

  const adj: Record<string, { to: string; w: number }[]> = {}
  links.forEach((l) => {
    const w = typeof l.length_km === 'number' ? l.length_km : 1
    adj[l.a] = adj[l.a] || []
    adj[l.b] = adj[l.b] || []
    adj[l.a].push({ to: l.b, w })
    adj[l.b].push({ to: l.a, w })
  })

  while (q.size) {
    let u = Array.from(q).reduce((a, b) => (dist[a] < dist[b] ? a : b))
    q.delete(u)
    if (u === dst || dist[u] === Infinity) break
    for (const edge of adj[u] || []) {
      const alt = dist[u] + edge.w
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt
        prev[edge.to] = u
      }
    }
  }

  if (dist[dst] === Infinity) return null
  const path: string[] = []
  let cur: string | null = dst
  while (cur) {
    path.unshift(cur)
    cur = prev[cur]
  }
  return { path, distance: dist[dst] }
}

// Dijkstra by cost (OSPF)
export function dijkstraCost(nodes: string[], links: { a: string; b: string; cost: number }[], src: string, dst: string) {
  const dist: Record<string, number> = {}
  const prev: Record<string, string | null> = {}
  const q = new Set<string>(nodes)
  nodes.forEach((n) => {
    dist[n] = Infinity
    prev[n] = null
  })
  dist[src] = 0

  const adj: Record<string, { to: string; w: number }[]> = {}
  links.forEach((l) => {
    adj[l.a] = adj[l.a] || []
    adj[l.b] = adj[l.b] || []
    adj[l.a].push({ to: l.b, w: l.cost })
    adj[l.b].push({ to: l.a, w: l.cost })
  })

  while (q.size) {
    let u = Array.from(q).reduce((a, b) => (dist[a] < dist[b] ? a : b))
    q.delete(u)
    if (u === dst || dist[u] === Infinity) break
    for (const edge of adj[u] || []) {
      const alt = dist[u] + edge.w
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt
        prev[edge.to] = u
      }
    }
  }

  if (dist[dst] === Infinity) return null
  const path: string[] = []
  let cur: string | null = dst
  while (cur) {
    path.unshift(cur)
    cur = prev[cur]
  }
  return { path, cost: dist[dst] }
}

// Parse OSPF-like text: lines like `LSA: A -> B cost=10`
export function parseOSPF(txt: string) {
  const links: { a: string; b: string; cost: number }[] = []
  const nodes = new Set<string>()
  const matched: string[] = []
  const skipped: string[] = []
  const seen = new Set<string>()

  const ipv4 = "(?:\\d{1,3}(?:\\.\\d{1,3}){3})"
  const lsaRe = new RegExp(`LSA:\\s*(\\S+)\\s*->\\s*(\\S+)(?:\\s*cost=(\\d+))?`)
  // Matches lines containing two IPv4 addresses (first two columns are typically Link ID and ADV Router)
  const ipPairRe = new RegExp(`(${ipv4})\\s+(${ipv4})`)

  txt.split('\n').forEach((raw) => {
    const l = raw.trim()
    if (!l) return

    // 1) legacy LSA: A -> B cost=10
    const m = l.match(lsaRe)
    if (m) {
      const a = m[1]
      const b = m[2]
      const cost = m[3] ? Number(m[3]) : 1
      nodes.add(a)
      nodes.add(b)
      const key = [a, b].sort().join('|')
      if (!seen.has(key)) {
        seen.add(key)
        links.push({ a, b, cost })
      }
      matched.push(raw)
      return
    }

    // 2) Cisco/FRR `show ip ospf database` style lines where first two columns are IPs
    const m2 = l.match(ipPairRe)
    if (m2) {
      const a = m2[1]
      const b = m2[2]
      // If a and b are identical (advertising router == link id), skip creating self-link
      if (a === b) return
      // try to find a numeric token after the matched pair (often 'Age' or 'Link count') and use as cost
      let cost = 1
      try {
        const rest = raw.slice((m2.index || 0) + m2[0].length)
        const nm = rest.match(/\b(\d{1,6})\b/)
        if (nm) {
          const n = Number(nm[1])
          if (!Number.isNaN(n) && n > 0 && n < 10000) cost = n
        }
      } catch (e) {
        /* ignore */
      }
      nodes.add(a)
      nodes.add(b)
      const key = [a, b].sort().join('|')
      if (!seen.has(key)) {
        seen.add(key)
        links.push({ a, b, cost })
      }
      matched.push(raw)
      return
    }
    // otherwise record as skipped line (useful for preview/debug)
    skipped.push(raw)
  })

  return { nodes: Array.from(nodes), links, matched, skipped }
}
