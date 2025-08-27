import Navbar from "../components/layout/Navbar.jsx";
import HeroSection from "../components/layout/HeroSection.jsx";
// import CategoryCarousel from "../components/layout/CategoryCarousel.jsx";
import LatestJob from "../components/layout/LatestJob.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx"

const Home = () => {
  useGetAllJobs()
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.role === "recruiter") {
      navigate("/admin/companies");
    }
  },  [user, navigate]);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LatestJob />
      <Footer />
    </div>
  );
};

export default Home;
