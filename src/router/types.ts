import { ComponentType } from "react"
import { Register } from "./my-router"
import { z } from "zod"

export type RegisteredRoutes = Register extends { routes: infer R }
  ? R extends readonly (infer Route)[]
    ? Route
    : never
  : DefinedRoute<z.AnyZodObject, unknown, boolean>[]

export type NavigableRoutes = Exclude<RegisteredRoutes, { layout: true }>

export type DynamicRoute = `${string}/:${string}`

export type RouteWithParams<
  Params extends z.AnyZodObject,
  Loader,
  Layout extends boolean = false
> = BaseRoute<Layout> & {
  path: DynamicRoute
  params: Params
  loader?: (params: z.infer<Params>) => Promise<Loader>
}

export type RouteWithNoParams<
  Loader,
  Layout extends boolean = false
> = BaseRoute<Layout> & {
  path: string
  loader?: () => Promise<Loader>
}

export type ParamsForPath<Path extends RegisteredRoutes["path"]> =
  Path extends DynamicRoute
    ? Extract<RegisteredRoutes, { path: Path }> extends { params: infer P }
      ? P extends z.AnyZodObject
        ? z.infer<P>
        : never
      : never
    : never

export function isDynamicRoute<
  Params extends z.AnyZodObject,
  Loader,
  Layout extends boolean = false
>(
  route:
    | Omit<DefinedRoute<Params, Loader, Layout>, "path">
    | DefinedRoute<Params, Loader, Layout>
): route is RouteWithParams<Params, Loader, Layout> {
  return (route as RouteWithParams<Params, Loader, Layout>).params != null
}

type BaseRoute<Layout extends boolean = false> = {
  component: ComponentType
  layout?: Layout
}

type DefinedRoute<
  Params extends z.AnyZodObject,
  Loader,
  Layout extends boolean = false
> = RouteWithParams<Params, Loader, Layout> | RouteWithNoParams<Loader, Layout>
