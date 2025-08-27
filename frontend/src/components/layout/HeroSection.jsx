import { Button } from "@/components/ui/button";
import { Search, Briefcase, Upload, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import suitcase from "../../assets/suitcase.png";
import { motion } from "motion/react";
import profile from "../../assets/profile.png"
import loupe from "../../assets/loupe.png"
import approved from "../../assets/approved.png"
import briefcase from "../../assets/briefcase1.png"

const HeroSection = () => {
  const roles = [
    "Full Stack Developer",
    "Back-end Developer",
    "Graphic Designer",
    "Senior Accountant",
    "UI Designer",
    "Employer Branding Associate",
  ];

  const roles1 = [
    "Frontend Developer",
    "AI Engineer",
    "Data Analyst",
    "Cloud Engineer",
    "IT Infrastructure",
    "Lead DevOps Engineer",
  ];

  const steps = [
    {
      icon: profile,
      title: "Create an Account",
      description:
        "Signup for the job applicant profile, mention your qualifications, past experiences, and expertise, and scope your interests. Voilà! You’re all set to find your dream jobs.",
    },
    {
      icon: loupe,
      title: "Search Job",
      description:
        "Once you set your job hunting parameters, you’ll find many openings related to your career interest on the home page and even filter out some of the best job openings.",
    },
    {
      icon: approved,
      title: "Upload CV / Resume",
      description:
        "From numerous job openings, shortlist the right match vacancy to your profile and apply right after by uploading your CV/Resume and answering a couple of questions, if any.",
    },
    {
      icon: briefcase,
      title: "Get Job",
      description:
        "After applying, wait for some time, schedule an interview, and if everything goes right, then get hired more quickly than traditional hiring methods.",
    },
  ];

  return (
    <div className="text-center">
      {/* HERO */}
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-200 text-blue-500 font-medium flex items-center gap-2 w-fit">
          <img src={suitcase} alt="briefcase" className="w-4 h-4" />
          No. 1 Job Portal Website
        </span>

        <h1 className="text-5xl font-bold">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-blue-500">Dream Job</span>
        </h1>
        <p className="font-medium">
          Start your hunt for the best, life-changing career opportunities from
          here <br /> in your selected area conveniently and get hired
        </p>
      </div>

      <div className="overflow-hidden mb-5 w-[1100px] mx-auto">
        <motion.div
          className="flex gap-3"
          animate={{ x: ["0%", "-100%"] }} // move from 0% to -100%
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 70,
            ease: "linear",
          }}
        >
          {roles.concat(roles).map(
            (
              role,
              i // duplicate for seamless loop
            ) => (
              <Badge
                key={i}
                variant="outline"
                className="rounded-full px-4 py-1 text-sm cursor-pointer hover:bg-purple-100 hover:text-blue-400 transition"
              >
                {role}
              </Badge>
            )
          )}
        </motion.div>
      </div>

      <div className="overflow-hidden mb-10 w-[1100px] mx-auto">
        <motion.div
          className="flex gap-3"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          }}
        >
          {roles1.concat(roles).map((role, i) => (
            <Badge
              key={i}
              variant="outline"
              className="rounded-full px-4 py-1 text-sm cursor-pointer hover:bg-purple-100 hover:text-blue-400 transition"
            >
              {role}
            </Badge>
          ))}
        </motion.div>
      </div>

      {/* HEADING */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Get Hired in{" "}
          <span className="text-blue-500">4 Quick Easy Steps</span>
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          The quickest and most effective way to get hired by the top firm
          working in your career interest areas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-[1300px] m-auto">
        {steps.map((step, i) => (
          <Card
            key={i}
            className="shadow-md rounded-2xl p-4 hover:shadow-lg transition"
          >
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <img src={step.icon} alt={step.title} className="w-10 h-10" />
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
