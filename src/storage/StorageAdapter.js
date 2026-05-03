/**
 * @typedef {{ ok: true, value: any }} OkResult
 * @typedef {{ ok: false, error: 'NotFound' | 'QuotaExceeded' | 'Invalid' }} ErrResult
 * @typedef {OkResult | ErrResult} Result
 */

/**
 * StorageAdapter interface.
 * All methods return Promises so async backends can be swapped in without
 * changing callers.
 *
 * @interface
 */
export class StorageAdapter {
  /** @returns {Promise<Result>} */
  async get(_key) { throw new Error('not implemented') }

  /** @returns {Promise<Result>} */
  async set(_key, _value) { throw new Error('not implemented') }

  /** @returns {Promise<Result>} */
  async remove(_key) { throw new Error('not implemented') }

  /**
   * List all keys that start with prefix.
   * @returns {Promise<Result>} value is string[]
   */
  async list(_prefix) { throw new Error('not implemented') }
}

/** @param {any} value @returns {OkResult} */
export const ok = (value) => ({ ok: true, value })

/** @param {'NotFound'|'QuotaExceeded'|'Invalid'} error @returns {ErrResult} */
export const err = (error) => ({ ok: false, error })
