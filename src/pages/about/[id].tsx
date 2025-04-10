import { z } from "zod"
import { defineRoute } from "../../router/defineRoute"

export const aboutRoute = defineRoute("/about/:id", {
  component: AboutPage,
  params: z.object({ id: z.coerce.number() }),
})

function AboutPage() {
  const params = aboutRoute.useParams()
  return <h3>About - {params.id}</h3>
}
