import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tasks from "./pages/Tasks";
import WelcomePage from "./pages/WelcomePage";
import Auth from "./pages/Auth";

const router = createBrowserRouter([
  {
    path: '/simpletodo/',
    element: <WelcomePage />
  }, {
    path: '/simpletodo/auth',
    element: <Auth />
  }, 
  {
    path: '/simpletodo/tasks',
    element: <Tasks />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
