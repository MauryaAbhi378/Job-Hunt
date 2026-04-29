import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home.jsx";
import Login from "./page/auth/Login.jsx";
import Signup from "./page/auth/Signup.jsx";
import Jobs from "./page/Jobs.jsx";
import Browse from "./page/Browse.jsx";
import Profile from "./components/layout/Profile.jsx";
import JobDescription from "./components/layout/JobDescription.jsx";
import CompanyOverview from "./components/layout/CompanyOverview.jsx";
import CreateJobs from "./components/admin/CreateJobs.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import Onboarding from "./components/admin/Onboarding.jsx";
import OnboardingRoute from "./components/admin/OnboardingRoute.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import Application from "./components/layout/Application.jsx";
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
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
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
      path: "/applications",
      element: <Application />,
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
      path: "/company/:id",
      element: <CompanyOverview />,
    },
    {
      path: "/admin/jobs",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <Dashboard />
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
      path: "/admin/create/job",
      element: (
        <OnboardingRoute>
          <ProtectedRoute>
            <CreateJobs />
          </ProtectedRoute>
        </OnboardingRoute>
      ),
    },
    {
      path: "/admin/post-job",
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

  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
