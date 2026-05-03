import { LocalStorageAdapter } from './LocalStorageAdapter.js'

let _adapter = new LocalStorageAdapter()

/** @returns {import('./LocalStorageAdapter.js').LocalStorageAdapter} */
export const getDefaultAdapter = () => _adapter

/** Override the default adapter (used in tests and future backend swap). */
export const setDefaultAdapter = (adapter) => { _adapter = adapter }
