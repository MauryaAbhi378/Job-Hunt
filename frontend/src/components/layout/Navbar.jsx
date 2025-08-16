import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User2, LogOut } from "lucide-react";

const Navbar = () => {
  let [user, setUser] = useState(false);
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Job <span className="text-[#F83002]">Hunt</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/job">Jobs</Link>
            </li>
            <li>
              <Link>Browse</Link>
            </li>
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="cursor-pointer">
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-[#f54721] hover:bg-[#F83002] cursor-pointer">
                <Link to="/signup">SignUp</Link>
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Abhishek</h4>
                      <p className="text-small text-muted-foreground">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Link to="/profile" className="flex items-center">
                      <User2 />
                      <button className="px-2 py-2 bg-white text-black cursor-pointer outline-none hover:underline underline-offset-4">
                        View Profile
                      </button>
                    </Link>
                    <Link to="/logout" className="flex items-center">
                      <LogOut />
                      <button className="px-2 py-2 bg-white text-black cursor-pointer outline-none  hover:underline underline-offset-4">
                        Logout
                      </button>
                    </Link>
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
