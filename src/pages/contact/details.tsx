import { defineRoute } from "../../router/defineRoute"

export const contactDetailsRoute = defineRoute("/contact/test", {
  component: Page,
})

function Page() {
  return <h3>Contact Page</h3>
}
