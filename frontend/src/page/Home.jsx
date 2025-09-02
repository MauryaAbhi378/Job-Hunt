import Navbar from "../components/layout/Navbar.jsx";
import HeroSection from "../components/layout/HeroSection.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx"
import JobsByCategory from "../components/layout/JobsByCategory.jsx";
import Review from "../components/layout/Review.jsx";

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
      <JobsByCategory/>
      <Review/>
      <Footer />
    </div>
  );
};

export default Home;
