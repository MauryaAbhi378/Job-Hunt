import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Login from "./page/auth/Login.jsx";
import Signup from "./page/auth/Signup.jsx";
import Jobs from "./page/Jobs.jsx";
import Browse from "./page/Browse.jsx";
import Profile from "./components/layout/Profile.jsx";
import JobDescription from "./components/layout/JobDescription.jsx";
import Companies from "./components/admin/Companies.jsx";
import AdminJobs from "./components/admin/AdminJobs.jsx";
import CreateCompany from "./components/admin/CreateCompany.jsx";
import CompanySetup from "./components/admin/CompanySetup.jsx";
import CreateJobs from "./components/admin/CreateJobs.jsx";
import Applicants from "./components/admin/Applicants.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
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
    {
      path: "/jobs",
      element: <Jobs />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/description/:id",
      element: <JobDescription />,
    },
    {
      path: "/admin/companies",
      element: (
        <ProtectedRoute>
          <Companies />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/jobs",
      element: (
        <ProtectedRoute>
          <AdminJobs />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/companies/create",
      element: (
        <ProtectedRoute>
          <CreateCompany />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/companies/:id",
      element: (
        <ProtectedRoute>
          <CompanySetup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/jobs/create",
      element: (
        <ProtectedRoute>
          <CreateJobs />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/job/update/:id", 
      element: (
        <ProtectedRoute>
          <CreateJobs />
        </ProtectedRoute>
      ),
    },

    {
      path: "/admin/jobs/:id/applicants",
      element: (
        <ProtectedRoute>
          <Applicants />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
