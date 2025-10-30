import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Auth from "./pages/Auth";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />
  }, {
    path: '/tasks',
    element: <Tasks />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
