import { z } from "zod"
import {
  DynamicRoute,
  isDynamicRoute,
  RouteWithNoParams,
  RouteWithParams,
} from "./types"
import { useLoaderContext } from "./Outlet"
import { LoaderResult, useRouterContext } from "./RouterProvider"

type ExtractAllParamKeys<Path> =
  Path extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | ExtractAllParamKeys<`/${Rest}`>
    : Path extends `${string}/:${infer Param}`
    ? Param
    : never

type ValidateParams<
  Path extends string,
  Schema extends z.AnyZodObject
> = keyof z.infer<Schema> extends ExtractAllParamKeys<Path>
  ? ExtractAllParamKeys<Path> extends keyof z.infer<Schema>
    ? Schema
    : never // Missing required keys
  : never // Contains extra keys

export function defineRoute<
  const Path extends string,
  const Params extends Path extends DynamicRoute ? z.AnyZodObject : never,
  const Loader,
  const Layout extends boolean = false
>(
  path: Path,
  route: Path extends DynamicRoute
    ? Params extends z.AnyZodObject
      ? ValidateParams<Path, Params> extends never
        ? never
        : Omit<RouteWithParams<Params, Loader, Layout>, "path">
      : never
    : Omit<RouteWithNoParams<Loader, Layout>, "path">
) {
  return {
    ...route,
    path,
    layout: route.layout ?? false,
    useLoaderData: () => useLoaderContext() as LoaderResult<Loader>,
    useParams: (): z.infer<Params> => {
      const rawParams = useRouterContext().rawParams
      if (isDynamicRoute(route)) {
        return route.params.parse(rawParams)
      } else {
        return {}
      }
    },
  }
}
