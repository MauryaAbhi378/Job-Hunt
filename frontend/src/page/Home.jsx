import Navbar from "../components/layout/Navbar.jsx";
import HeroSection from "../components/layout/HeroSection.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx"
import Review from "../components/layout/Review.jsx";

const Home = () => {
  useGetAllJobs()
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (user.role === "recruiter") {
        navigate("/admin/companies");
      } else if (user.role === "student") {
        navigate("/jobs");
      }
    }
  },  [user, navigate]);

  // Only show home page if user is not logged in
  if (user) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Home;
