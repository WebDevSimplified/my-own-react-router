import { ComponentProps, MouseEvent } from "react"
import { useRouterContext } from "./RouterProvider"
import { DynamicRoute, NavigableRoutes, ParamsForPath } from "./types"

export function Link<Path extends NavigableRoutes["path"]>({
  onClick,
  href,
  params,
  ...props
}: Omit<ComponentProps<"a">, "href"> & {
  href: Path
} & (Path extends DynamicRoute
    ? { params: ParamsForPath<Path> }
    : { params?: never })) {
  const url =
    params == null
      ? href
      : Object.entries(params).reduce((acc, [key, value]) => {
          return acc.replace(`:${key}`, value.toString())
        }, href as string)

  const { goToUrl } = useRouterContext()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onClick?.(event)
    goToUrl(url)
  }
  return <a onClick={handleClick} href={url} {...props} />
}
