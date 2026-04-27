import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// This route checks if recruiter needs to complete onboarding
const OnboardingRoute = ({ children }) => {
  const { user, onboardingStatus } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, redirect to home
    if (!user) {
      navigate("/");
      return;
    }

    // Only check for recruiters
    if (user.role?.toLowerCase() === "recruiter") {
      // If onboarding is not completed, redirect to onboarding
      if (onboardingStatus && !onboardingStatus.isCompleted) {
        navigate("/onboarding");
        return;
      }
    }
  }, [user, onboardingStatus, navigate]);

  return <>{children}</>;
};

export default OnboardingRoute;
