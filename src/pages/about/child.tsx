import { z } from "zod"
import { defineRoute } from "../../router/defineRoute"

export const aboutChildRoute = defineRoute("/about/:id/child", {
  component: AboutChildPage,
  params: z.object({ id: z.number() }),
})

function AboutChildPage() {
  const params = aboutChildRoute.useParams()
  return <h3>About Child - {params.id}</h3>
}
