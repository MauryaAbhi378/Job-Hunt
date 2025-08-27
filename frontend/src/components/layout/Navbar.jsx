import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User2, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../../store/slice/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../utils/constant";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.log("Error occurred while logging out:", error);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-blue-500">Hunt</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/jobs">Find Job</Link>
                </li>
                {/* <li>
                  <Link to="/browse">Browse</Link>
                </li> */}
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="cursor-pointer">
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                <Link to="/signup">SignUp</Link>
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user.profile.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt="Profile"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          user.profile.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        alt="Profile"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user.fullname}</h4>
                      <p className="text-small text-muted-foreground">
                        {user.profile.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {user && user.role === "student" && (
                      <Link to="/profile" className="flex items-center">
                        <User2 />
                        <button className="px-2 py-2 bg-white text-black cursor-pointer outline-none hover:underline underline-offset-4">
                          View Profile
                        </button>
                      </Link>
                    )}
                    <div className="flex items-center">
                      <LogOut />
                      <button
                        onClick={logoutHandler}
                        className="px-2 py-2 bg-white text-black cursor-pointer outline-none  hover:underline underline-offset-4"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
