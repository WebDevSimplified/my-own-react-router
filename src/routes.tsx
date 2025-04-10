import { homeLayoutRoute } from "./pages/layout"
import { homeRoute } from "./pages/home"
import { aboutRoute } from "./pages/about/[id]"
import { aboutChildRoute } from "./pages/about/child"
import { aboutLayoutRoute } from "./pages/about/layout"
import { contactDetailsRoute } from "./pages/contact/details"

export const routes = [
  homeLayoutRoute,
  homeRoute,
  aboutRoute,
  aboutChildRoute,
  aboutLayoutRoute,
  contactDetailsRoute,
] as const

declare module "./router/my-router" {
  interface Register {
    routes: typeof routes
  }
}
