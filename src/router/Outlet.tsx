import { createContext, ReactNode, useContext } from "react"
import { useRouterContext } from "./RouterProvider"

const OutletContext = createContext<{ depth: number } | null>(null)
const LoaderContext = createContext<{ data: unknown }>({
  data: undefined,
})

export function Outlet() {
  const { matchedRoutes } = useRouterContext()
  const { depth } = useOutletContext()
  if (depth >= matchedRoutes.length) return null

  const Component = matchedRoutes.at(depth)?.component

  return (
    <OutletWrapper depth={depth}>
      {Component ? <Component /> : <Outlet />}
    </OutletWrapper>
  )
}

function useOutletContext() {
  const context = useContext(OutletContext)
  if (context == null) {
    throw new Error("useOutletContext must be used within an Outlet")
  }
  return context
}

export function useLoaderContext() {
  const context = useContext(LoaderContext)
  if (context == null) {
    throw new Error("useLoaderContext must be used within a LoaderContext")
  }
  return context.data
}

export function OutletWrapper({
  children,
  depth,
}: {
  children: ReactNode
  depth: number
}) {
  const { loaderData } = useRouterContext()
  return (
    <LoaderContext value={{ data: loaderData[depth] }}>
      <OutletContext value={{ depth: depth + 1 }}>{children}</OutletContext>
    </LoaderContext>
  )
}
