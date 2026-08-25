import { useEffect, useRef } from 'react'

export interface UseAutoSaveOptions {
  loanType: string
  state: unknown
  step: number
  interval?: number
}

export interface AutoSaveResult {
  isSaving: boolean
  lastSavedAt: string | null
}

export function useAutoSave({ loanType, state, step, interval = 30_000 }: UseAutoSaveOptions): AutoSaveResult {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedAtRef = useRef<string | null>(null)

  useEffect(() => {
    if (!loanType) return

    const save = async () => {
      try {
        const { subtle } = window.crypto
        const keyMaterial = await subtle.importKey(
          'raw',
          new TextEncoder().encode('lendswift-auto-save-key-2024'),
          'PBKDF2',
          false,
          ['deriveKey'],
        )
        const key = await subtle.deriveKey(
          { name: 'PBKDF2', salt: new TextEncoder().encode('lendswift-salt'), iterations: 100_000, hash: 'SHA-256' },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt'],
        )
        const iv = window.crypto.getRandomValues(new Uint8Array(12))
        const plaintext = new TextEncoder().encode(JSON.stringify(state))
        const cipherBuf = await subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
        const toBase64 = (buf: ArrayBuffer) =>
          btoa(String.fromCharCode(...new Uint8Array(buf)))
        const envelope = JSON.stringify({
          version: '1.0',
          timestamp: new Date().toISOString(),
          step,
          loanType,
          iv: toBase64(iv.buffer as ArrayBuffer),
          cipher: toBase64(cipherBuf),
        })
        localStorage.setItem(`lendswift_draft_${loanType}`, envelope)
        savedAtRef.current = new Date().toISOString()
      } catch {
        // silent — do not break UX on save failure
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      void save()
    }, interval)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [loanType, state, step, interval])

  return { isSaving: false, lastSavedAt: savedAtRef.current }
}
