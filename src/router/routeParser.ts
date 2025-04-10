import { RegisteredRoutes } from "./types"

export function routeParser(routes: readonly RegisteredRoutes[], url: string) {
  const layoutRoutes = routes.filter(route => route.layout)
  const contentRoutes = routes.filter(route => !route.layout)

  const matchedRoute = contentRoutes.find(route =>
    isRouteMatch(url, route.path)
  )

  if (matchedRoute == null) {
    return { routes: [], params: {} }
  }

  const matchingLayouts = layoutRoutes
    .filter(route => {
      const normalizedUrl = normalizeUrl(url).split("/")
      while (normalizedUrl.length > 0) {
        if (isRouteMatch(normalizedUrl.join("/"), route.path)) {
          return true
        }
        normalizedUrl.pop()
      }
    })
    .sort((a, b) => {
      return a.path.split("/").length - b.path.split("/").length
    })

  return {
    routes: [...matchingLayouts, matchedRoute],
    params: getParamsFromRoute(url, matchedRoute.path),
  }
}

function isRouteMatch(url: string, routeUrl: string) {
  const normalizedUrl = normalizeUrl(url).split("/")
  const normalizedRouteUrl = normalizeUrl(routeUrl).split("/")

  if (normalizedUrl.length !== normalizedRouteUrl.length) return false

  return normalizedRouteUrl.every((segment, index) => {
    if (segment.startsWith(":")) return true // Ignore dynamic segments
    return normalizedUrl[index] === segment
  })
}

function normalizeUrl(url: string) {
  if (url === "" || url === "/") return ""
  return `/${url.replace(/^\/+|\/+$/g, "")}`
}

function getParamsFromRoute(url: string, routeUrl: string) {
  const normalizedUrl = normalizeUrl(url).split("/")
  const normalizedRouteUrl = normalizeUrl(routeUrl).split("/")
  const params: Record<string, string> = {}

  normalizedRouteUrl.forEach((segment, index) => {
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = normalizedUrl[index]
    }
  })

  return params
}
