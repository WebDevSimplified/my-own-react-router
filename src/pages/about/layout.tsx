import { defineRoute } from "../../router/defineRoute"
import { Outlet } from "../../router/Outlet"

export const aboutLayoutRoute = defineRoute("/about", {
  layout: true,
  component: AboutLayout,
})

function AboutLayout() {
  return (
    <>
      <h2>About</h2>
      <Outlet />
    </>
  )
}
