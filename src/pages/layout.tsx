import { defineRoute } from "../router/defineRoute"
import { Link } from "../router/Link"
import { Outlet } from "../router/Outlet"

export const homeLayoutRoute = defineRoute("/", {
  layout: true,
  component: HomeLayout,
})

function HomeLayout() {
  return (
    <>
      <h1>My Router</h1>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <Link href="/">Home</Link>
        <Link href="/about/:id" params={{ id: 3 }}>
          About 3
        </Link>
        <Link href="/about/:id/child" params={{ id: 3 }}>
          About Child 3
        </Link>
        <Link href="/contact/test">Contact</Link>
      </div>
      <Outlet />
    </>
  )
}
