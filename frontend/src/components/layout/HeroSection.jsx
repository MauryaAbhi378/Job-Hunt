import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import suitcase from "../../assets/suitcase.png";
import LatestJob from "./LatestJob";
import { useSelector } from "react-redux";

const HeroSection = () => {
  const { jobs = [] } = useSelector((store) => store.job);

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-200 text-blue-500 font-medium flex items-center gap-2 w-fit">
          <img src={suitcase} alt="briefcase" className="w-4 h-4" />
          No. 1 Job Portal Website
        </span>

        <div>
          <h1 className="text-5xl font-bold">
            Search, Apply & <br /> Get Your{" "}
            <span className="text-blue-500">Dream Job</span>
          </h1>
          <p className="mt-3 text-gray-600 font-medium">
            {jobs.length} jobs listed here! Your dream job is waiting
          </p>
        </div>
      </div>

      <LatestJob />
    </div>
  );
};

export default HeroSection;
