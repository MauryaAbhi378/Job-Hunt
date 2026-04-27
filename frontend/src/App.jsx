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
import Onboarding from "./components/admin/Onboarding.jsx";
import OnboardingRoute from "./components/admin/OnboardingRoute.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
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
      path: "/onboarding",
      element: <Onboarding />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
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
        <OnboardingRoute>
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/jobs",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/companies/create",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <CreateCompany />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/companies/:id",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <CompanySetup />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/jobs/create",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <CreateJobs />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/job/update/:id", 
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <CreateJobs />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },

    {
      path: "/admin/jobs/:id/applicants",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        </OnboardingRoute>
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
