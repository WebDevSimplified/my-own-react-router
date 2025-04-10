import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "./router/RouterProvider"
import { routes } from "./routes"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider routes={routes} />
  </StrictMode>
)
