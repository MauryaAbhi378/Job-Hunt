import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/Signup",
      element: <Signup />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
