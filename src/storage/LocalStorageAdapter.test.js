import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageAdapter } from './LocalStorageAdapter.js'

// localStorage is cleared before each test by test-setup.js

describe('LocalStorageAdapter', () => {
  let adapter

  beforeEach(() => {
    adapter = new LocalStorageAdapter()
  })

  it('round-trips a value', async () => {
    await adapter.set('foo', { x: 1 })
    const r = await adapter.get('foo')
    expect(r).toEqual({ ok: true, value: { x: 1 } })
  })

  it('returns NotFound for missing key', async () => {
    const r = await adapter.get('missing')
    expect(r).toEqual({ ok: false, error: 'NotFound' })
  })

  it('removes a key', async () => {
    await adapter.set('k', 42)
    await adapter.remove('k')
    const r = await adapter.get('k')
    expect(r.ok).toBe(false)
    expect(r.error).toBe('NotFound')
  })

  it('lists keys by prefix', async () => {
    await adapter.set('character:a', 1)
    await adapter.set('character:b', 2)
    await adapter.set('adventure:x', 3)
    const r = await adapter.list('character:')
    expect(r.ok).toBe(true)
    expect(r.value.sort()).toEqual(['character:a', 'character:b'])
  })

  it('returns empty array when no keys match prefix', async () => {
    const r = await adapter.list('nope:')
    expect(r).toEqual({ ok: true, value: [] })
  })

  it('returns Invalid for corrupt JSON', async () => {
    localStorage.setItem('bad', '{not json')
    const r = await adapter.get('bad')
    expect(r).toEqual({ ok: false, error: 'Invalid' })
  })

  it('overwrites an existing key', async () => {
    await adapter.set('k', 1)
    await adapter.set('k', 2)
    const r = await adapter.get('k')
    expect(r.value).toBe(2)
  })
})
