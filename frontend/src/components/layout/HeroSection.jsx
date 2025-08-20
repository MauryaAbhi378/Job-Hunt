import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "../../store/slice/jobSlice";

const HeroSection = () => {
  const[query, setQuery]  = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

 const searchJobHandler = () => {
  dispatch(setSearchQuery(query))
  navigate("/browse")
 }

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          No. 1 Job Portal Website
        </span>
        <h1 className="text-5xl font-bold">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-[#F83002]">Dream Job</span>
        </h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae rerum,
          ab doloremque fugit dolorem laudantium.
        </p>
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Find your dream job"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full p-2"
          />
          <Button onClick={searchJobHandler} className="rounded-r-full bg-[#F83002] cursor-pointer">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
