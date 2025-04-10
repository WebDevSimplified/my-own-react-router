import { defineRoute } from "../router/defineRoute"
import { useRouterContext } from "../router/RouterProvider"

export const homeRoute = defineRoute("/", {
  component: HomePage,
  loader: async () => {
    return new Promise<{ hi: string }>(resolve => {
      setTimeout(() => {
        resolve({ hi: "hello" })
      }, 1000)
    })
  },
})

function HomePage() {
  const { data, state } = homeRoute.useLoaderData()
  const { navigate } = useRouterContext()

  return (
    <>
      <h2>Home - {state === "loaded" ? data.hi : "loading"}</h2>
      <button
        onClick={() => navigate({ url: "/about/:id", params: { id: 1 } })}
      >
        Go To About 1
      </button>
    </>
  )
}
