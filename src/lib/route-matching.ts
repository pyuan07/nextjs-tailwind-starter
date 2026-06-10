/**
 * Shared route-matching predicate used by both middleware and AuthGuard.
 * A path matches a route when it is exactly equal or starts with `route/`
 * (the trailing slash prevents /profile-settings from matching /profile).
 */
export function matchesRoute(path: string, routes: readonly string[]): boolean {
  return routes.some(r => path === r || path.startsWith(`${r}/`))
}
