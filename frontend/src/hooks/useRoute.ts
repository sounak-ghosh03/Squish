import { useState, useEffect, useCallback } from 'react'

type Route = '/' | '/privacy' | '/terms'

const VALID_ROUTES: Route[] = ['/', '/privacy', '/terms']

function getRoute(): Route {
  const p = window.location.pathname as Route
  return VALID_ROUTES.includes(p) ? p : '/'
}

/**
 * Minimal client-side router that reads window.location.pathname.
 * Supports browser back/forward navigation via popstate.
 * No React Router dependency needed.
 */
export function useRoute() {
  const [route, setRoute] = useState<Route>(getRoute)

  useEffect(() => {
    const handler = () => setRoute(getRoute())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const navigate = useCallback((to: Route) => {
    window.history.pushState(null, '', to)
    setRoute(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { route, navigate }
}
