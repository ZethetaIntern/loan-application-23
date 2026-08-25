import type { LoanType } from '../types/domain'
import { DRAFT_TTL_MS } from '../utils/constants'

const DRAFT_PREFIX = 'lendswift_draft_'
const ENVELOPE_VERSION = '1.0'
const IV_LENGTH_BYTES = 12

export const PASSPHRASE = 'lendswift-local-draft-key'

export interface DraftEnvelope {
  version: string
  timestamp: string
  step: number
  loanType: LoanType
  iv: string
  cipher: string
}

export async function deriveKey(passphrase: string = PASSPHRASE): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(passphrase))
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function encryptJson(key: CryptoKey, payload: unknown): Promise<{ iv: string; cipher: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES))
  const encoded = new TextEncoder().encode(JSON.stringify(payload))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  return { iv: toBase64(iv.buffer as ArrayBuffer), cipher: toBase64(cipher) }
}

export async function decryptJson<T>(key: CryptoKey, ivB64: string, cipherB64: string): Promise<T> {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(ivB64) },
    key,
    fromBase64(cipherB64) as unknown as BufferSource,
  )
  return JSON.parse(new TextDecoder().decode(plain)) as T
}

export function draftKey(loanType: LoanType): string {
  return `${DRAFT_PREFIX}${loanType}`
}

export async function saveDraft(loanType: LoanType, step: number, state: unknown): Promise<string> {
  const key = await deriveKey()
  const { iv, cipher } = await encryptJson(key, state)
  const envelope: DraftEnvelope = {
    version: ENVELOPE_VERSION,
    timestamp: new Date().toISOString(),
    step,
    loanType,
    iv,
    cipher,
  }
  localStorage.setItem(draftKey(loanType), JSON.stringify(envelope))
  return envelope.timestamp
}

export async function loadDraft<T>(loanType: LoanType): Promise<(DraftEnvelope & { state: T }) | null> {
  const raw = localStorage.getItem(draftKey(loanType))
  if (!raw) return null
  try {
    const envelope = JSON.parse(raw) as DraftEnvelope
    if (envelope.version !== ENVELOPE_VERSION) throw new Error('version mismatch')
    if (Date.now() - new Date(envelope.timestamp).getTime() > DRAFT_TTL_MS) {
      clearDraft(loanType)
      return null
    }
    const key = await deriveKey()
    const state = await decryptJson<T>(key, envelope.iv, envelope.cipher)
    if (!state || typeof state !== 'object') throw new Error('payload shape invalid')
    return { ...envelope, state }
  } catch {
    clearDraft(loanType)
    return null
  }
}

export function clearDraft(loanType: LoanType): void {
  localStorage.removeItem(draftKey(loanType))
}

export function purgeExpiredDrafts(now: number = Date.now()): number {
  let purged = 0
  for (let i = 0; i < localStorage.length; i += 1) {
    const storageKey = localStorage.key(i)
    if (!storageKey || !storageKey.startsWith(DRAFT_PREFIX)) continue
    try {
      const envelope = JSON.parse(localStorage.getItem(storageKey) ?? '') as DraftEnvelope
      if (now - new Date(envelope.timestamp).getTime() > DRAFT_TTL_MS) {
        localStorage.removeItem(storageKey)
        purged += 1
        i -= 1
      }
    } catch {
      localStorage.removeItem(storageKey)
      purged += 1
      i -= 1
    }
  }
  return purged
}
