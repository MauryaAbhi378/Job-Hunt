import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { USER_API_ENDPOINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../store/slice/authSlice.js";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        // console.log(res.data)
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error occur while submitting login form", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          aria-labelledby="signup-heading"
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 id="signup-heading" className="font-bold text-xl mb-5">
            Login
          </h1>
          <div className="my-2">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              type="email"
              placeholder="you@example.com"
              required
              aria-required="true"
              autoComplete="email"
            />
          </div>

          <div className="my-2">
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              type="password"
              placeholder="Enter your password"
              required
              aria-required="true"
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center justify-between gap-6 mt-5 mb-1">
            <RadioGroup
              value={input.role}
              onValueChange={(value) =>
                setInput((prev) => ({ ...prev, role: value }))
              }
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="student"
                  name="role"
                  id="student"
                  className="cursor-pointer"
                />
                <Label htmlFor="student" className="cursor-pointer">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="recruiter"
                  name="role"
                  id="recruiter"
                  className="cursor-pointer"
                />
                <Label htmlFor="recruiter" className="cursor-pointer">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              aria-label="Create your account"
              className="w-full my-4 cursor-pointer"
            >
              Login
            </Button>
          )}
          <span className="text-small">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#f54721]">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
