import { routeParser } from "./routeParser"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Outlet, OutletWrapper } from "./Outlet"
import {
  DynamicRoute,
  isDynamicRoute,
  NavigableRoutes,
  ParamsForPath,
  RegisteredRoutes,
} from "./types"

const RouterContext = createContext<{
  matchedRoutes: RegisteredRoutes[]
  goToUrl: (url: string) => void
  navigate<Path extends NavigableRoutes["path"]>({
    url,
    params,
  }: { url: Path } & (Path extends DynamicRoute
    ? { params: ParamsForPath<Path> }
    : { params?: never })): void
  rawParams: Record<string, string>
  loaderData: unknown[]
}>({
  loaderData: [],
  matchedRoutes: [],
  navigate: () => {},
  goToUrl: () => {},
  rawParams: {},
})

export type LoaderResult<Loader> =
  | {
      data: Loader
      state: "loaded"
      error?: never
    }
  | {
      data?: never
      state: "loading" | "no-loader"
      error?: Error
    }
  | {
      data?: never
      state: "error"
      error: Error
    }

export function useRouterContext() {
  const context = useContext(RouterContext)
  if (context == null) {
    throw new Error("useRouterContext must be used within a RouterProvider")
  }
  return context
}

export function RouterProvider({
  routes,
}: {
  routes: readonly RegisteredRoutes[]
}) {
  const [matchedRoutes, setMatchedRoutes] = useState<RegisteredRoutes[]>([])
  const [rawParams, setRawParams] = useState<Record<string, string>>({})
  const [loaderData, setLoaderData] = useState<LoaderResult<unknown>[]>([])

  const handleRouteChange = useCallback(() => {
    const currentUrl = window.location.pathname
    const { routes: matchedRoutes, params } = routeParser(routes, currentUrl)
    setMatchedRoutes(matchedRoutes)
    setRawParams(params)
    setLoaderData(
      matchedRoutes.map(route => ({
        state: route.loader ? "no-loader" : "loading",
      }))
    )
  }, [routes])

  useEffect(() => {
    matchedRoutes.forEach((route, index) => {
      if (route.loader != null) {
        setLoaderData(data => {
          const newData = [...data]
          newData[index] = {
            state: "loading",
          }
          return newData
        })
        const loader = isDynamicRoute(route)
          ? route.loader(route.params.parse(rawParams))
          : route.loader()

        loader
          .then(res => {
            setLoaderData(data => {
              const newData = [...data]
              newData[index] = {
                data: res,
                state: "loaded",
              }
              return newData
            })
          })
          .catch(error => {
            setLoaderData(data => {
              const newData = [...data]
              newData[index] = {
                state: "error",
                error,
              }
              return newData
            })
          })
      }
    })
  }, [matchedRoutes, rawParams])

  // Can this be done better
  useEffect(() => {
    handleRouteChange()
  }, [handleRouteChange])

  useEffect(() => {
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [handleRouteChange])

  function goToUrl(url: string) {
    window.history.pushState({}, "", url)
    handleRouteChange()
  }

  function navigate<Path extends NavigableRoutes["path"]>({
    url,
    params,
  }: { url: Path } & (Path extends DynamicRoute
    ? { params: ParamsForPath<Path> }
    : { params?: never })) {
    const parsedUrl =
      params == null
        ? url
        : Object.entries(params).reduce((acc, [key, value]) => {
            return acc.replace(`:${key}`, value.toString())
          }, url as string)

    window.history.pushState({}, "", parsedUrl)
    handleRouteChange()
  }

  return (
    <RouterContext
      value={{ matchedRoutes, navigate, goToUrl, rawParams, loaderData }}
    >
      <OutletWrapper depth={-1}>
        <Outlet />
      </OutletWrapper>
    </RouterContext>
  )
}
