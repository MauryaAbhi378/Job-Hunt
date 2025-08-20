import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar.jsx";
import useDebounce from "../../hooks/useDebounce.jsx";
import { USER_API_ENDPOINT } from "../../utils/constant.js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/slice/authSlice.js";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const [errors, setErrors] = useState({});
  const debouncedInput = useDebounce(input, 1000);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  useEffect(() => {
    const newErrors = {};
    if (debouncedInput.fullname && debouncedInput.fullname.length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters";
    }

    if (debouncedInput.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(debouncedInput.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (debouncedInput.phoneNumber) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(debouncedInput.phoneNumber)) {
        newErrors.phoneNumber = "Enter a valid phone Number";
      }
    }

    if (debouncedInput.password && debouncedInput.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
  }, [debouncedInput]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      console.log("Fill the form correctly");
      toast.error("Fill the form correctly");
    } else {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("role", input.role);
      if (input.file) {
        formData.append("file", input.file);
      }

      try {
        dispatch(setLoading(true));
        const res = await axios.post(
          `${USER_API_ENDPOINT}/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          navigate("/login");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log("Error during Submitting Signup Form", error);
      } finally {
        dispatch(setLoading(false));
      }
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
            Sign Up
          </h1>

          <div className="my-2">
            <Label htmlFor="fullName" className="mb-2">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              type="text"
              placeholder="Enter your full name"
              required
              aria-required="true"
              autoComplete="name"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.fullname}
              </p>
            )}
          </div>

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
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.email}
              </p>
            )}
          </div>

          <div className="my-2">
            <Label htmlFor="phoneNumber" className="mb-2">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              type="tel"
              placeholder="Enter your phone number"
              required
              aria-required="true"
              autoComplete="tel"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.phoneNumber}
              </p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                {errors.password}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-6">
            <RadioGroup
              value={input.role}
              onValueChange={(value) =>
                setInput((prev) => ({ ...prev, role: value }))
              }
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="student" value="student" />
                <Label htmlFor="student" className="cursor-pointer">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="recruiter" value="recruiter" />
                <Label htmlFor="recruiter" className="cursor-pointer">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-2">
              <Label htmlFor="profile" className="cursor-pointer">
                Profile
              </Label>
              <Input
                id="profile"
                accept="image/*"
                onChange={changeFileHandler}
                type="file"
                className="cursor-pointer"
              />
            </div>
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
              Sign Up
            </Button>
          )}
          <span className="text-small">
            Already have an account?{" "}
            <Link to="/login" className="text-[#f54721]">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
