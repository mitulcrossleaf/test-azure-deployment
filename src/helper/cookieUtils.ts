'use server'

import { cookies } from 'next/headers'

/**
 * Get all cookies as a plain object { name: value }
 */
export async function getAllCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const result: Record<string, string> = {}
  cookieStore.getAll().forEach(({ name, value }) => {
    result[name] = value
  })
  return result
}

/**
 * Get a single cookie value (or undefined).
 */
export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}

/**
 * Set a cookie (server-side). By default, sets HttpOnly & Secure cookies.
 */
export async function setCookie(
  name: string,
  value: string,
  options: {
    path?: string
    maxAge?: number
    expires?: Date
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}
): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set({
    name,
    value,
    path: options.path ?? '/',
    maxAge: options.maxAge,
    expires: options.expires,
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? true,
    sameSite: options.sameSite ?? 'lax',
  })
}

/**
 * Delete a cookie by name.
 */
export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}
