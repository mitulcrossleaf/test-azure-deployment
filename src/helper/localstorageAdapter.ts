import { buildStorage } from 'axios-cache-interceptor'

export const localStorageAdapter = buildStorage({
  async set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  async find(key) {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  async remove(key) {
    localStorage.removeItem(key)
  },
  async clear() {
    localStorage.clear()
  },
})
