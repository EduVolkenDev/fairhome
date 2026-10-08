'use client'

import { useEffect, useState } from 'react'
import { createInitialAppState, readAppState, saveAppState, type AppState } from './app-state'

export function useAppState() {
  const [state, setState] = useState<AppState>(() => createInitialAppState())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // The first client render uses the deterministic demo state; this hydration
    // step intentionally replaces it with the user's persisted local state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readAppState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveAppState(state)
  }, [hydrated, state])

  return { state, setState, hydrated }
}
