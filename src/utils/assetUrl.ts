/**
 * ElementraUI — Universal Asset URL Resolver
 *
 * Ensures asset paths resolve correctly whether the application is deployed
 * at the domain root ("/") or under a subpath (e.g. "/elementraui/").
 *
 * Uses Vite's `import.meta.env.BASE_URL`.
 */

export function resolveAssetUrl(rawPath: string | undefined | null): string {
  if (!rawPath) return ""

  // Do not modify external URLs or data/blob URIs
  if (
    rawPath.startsWith("http://") ||
    rawPath.startsWith("https://") ||
    rawPath.startsWith("data:") ||
    rawPath.startsWith("blob:")
  ) {
    return rawPath
  }

  // Get base URL from Vite environment, default to "/"
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "")

  // Strip leading slash from rawPath so we can join cleanly
  const cleanPath = rawPath.replace(/^\/+/, "")

  // Return base + "/" + cleanPath (or just "/" + cleanPath if base is empty)
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`
}
