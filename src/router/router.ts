import { ReactNode } from "react"
import { z } from "zod"

export type Route<
  Path extends string,
  P extends z.AnyZodObject = z.AnyZodObject,
  R = unknown
> = {
  path: Path
  component?: ReactNode
  params?: P
  loader?: P extends z.AnyZodObject
    ? (params: z.infer<P>) => Promise<R>
    : undefined
}

export type ParsedRoute = {
  component: ReactNode
  params?: z.AnyZodObject
}
