import { describe, it, expect } from 'vitest'
import { dijkstraDistance, dijkstraCost, parseOSPF } from './algorithms'

describe('algorithms', () => {
  it('dijkstraDistance finds shortest path by length', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }]
    const links = [
      { a: 'A', b: 'B', length_km: 5 },
      { a: 'B', b: 'C', length_km: 5 },
      { a: 'A', b: 'C', length_km: 12 },
      { a: 'C', b: 'D', length_km: 3 }
    ]
    const res = dijkstraDistance(nodes as any, links as any, 'A', 'D')
    expect(res).not.toBeNull()
    expect(res?.path.join('-')).toBe('A-B-C-D')
    expect(res?.distance).toBe(13)
  })

  it('dijkstraCost finds least cost path', () => {
    const nodes = ['R1', 'R2', 'R3']
    const links = [{ a: 'R1', b: 'R2', cost: 10 }, { a: 'R2', b: 'R3', cost: 1 }, { a: 'R1', b: 'R3', cost: 50 }]
    const res = dijkstraCost(nodes, links, 'R1', 'R3')
    expect(res).not.toBeNull()
    expect(res?.path.join('>')).toBe('R1>R2>R3')
    expect(res?.cost).toBe(11)
  })

  it('parseOSPF extracts nodes and costs', () => {
    const txt = `LSA: A -> B cost=5\nLSA: B -> C\nLSA: C -> D cost=2`
    const p = parseOSPF(txt)
    expect(p.nodes.sort()).toEqual(['A', 'B', 'C', 'D'].sort())
    expect(p.links.length).toBe(3)
    expect(p.links.find((l) => l.a === 'A' && l.b === 'B')?.cost).toBe(5)
    expect(p.links.find((l) => l.a === 'B' && l.b === 'C')?.cost).toBe(1)
  })

  it('parseOSPF handles show ip ospf database snippet', () => {
    const txt = `10.199.242.7    10.199.242.14   1129 0x8000007a 0x960e 10.199.242.7/32\n10.199.242.8    10.199.242.14   1710 0x8000007a 0xa067 10.199.242.8/32`
    const p = parseOSPF(txt)
    // nodes should include both IPs
    expect(p.nodes).toEqual(expect.arrayContaining(['10.199.242.7', '10.199.242.14', '10.199.242.8']))
    // links should include an edge between 10.199.242.7 and 10.199.242.14 with cost 1129
    const link = p.links.find((l) => (l.a === '10.199.242.7' && l.b === '10.199.242.14') || (l.a === '10.199.242.14' && l.b === '10.199.242.7'))
    expect(link).toBeDefined()
    expect(link?.cost).toBe(1129)
  })
})
