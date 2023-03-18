import {createHashRouter } from "react-router-dom"
import About from "./pages/About"
import Login from "./pages/Login"
import Main from "./pages/Main"
import NotFound from "./pages/NotFound"
import Person from "./pages/Person"
import System from "./pages/System"
//需要使用hash路由
//const router = createBrowserRouter([
const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/Main",
    element: <System />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Main />        
      },
      {
        path: "Person/:key",
        element: <Person />
      },
      {
        path: "About",
        element: <About />
      }
    ]
  },
])

export default router
