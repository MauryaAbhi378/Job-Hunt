import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CircleHelp,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  UsersRound,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { setUser } from "../../store/slice/authSlice";
import { USER_API_ENDPOINT } from "../../utils/constant";

const Sidebar = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, singleCompany } = useSelector((store) => store.company);
  const company = singleCompany || companies?.[0];
  const companyInitial = company?.name?.charAt(0)?.toUpperCase() || "J";

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message || "Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Applicants",
      path: "/admin/applicants",
      icon: UsersRound,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-[#dce4ef] bg-[#f8fbff] px-4 py-9">
      <div className="flex items-center gap-4 px-4">
        <div
          className={`flex items-center justify-center overflow-hidden text-lg font-bold uppercase leading-none text-white ${
            company?.logo
              ? "h-12 w-12"
              : "h-10 w-10 rounded-lg bg-[#0598cf] shadow-sm"
          }`}
        >
          {company?.logo ? (
            <img
              src={company.logo}
              alt={company.name || "Company logo"}
              className="max-w-none w-32 h-26"
            />
          ) : (
            companyInitial
          )}
        </div>
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#312ee6]">
            JobHunt
            <br />
            Portal
          </h2>
          <p className="mt-1 text-[12px] text-[#8190a6]">Talent Acquisition</p>
        </div>
      </div>

      <nav className="mt-11 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={`${item.label}-${item.path}`}
              to={item.path}
              className={({ isActive }) =>
                `flex h-11 items-center gap-4 rounded-md px-4 text-[15px] font-medium transition ${
                  isActive && item.label !== "Analytics"
                    ? "bg-white text-[#17233c] shadow-sm"
                    : "text-[#17233c] hover:bg-white"
                }`
              }
            >
              <Icon className="h-5 w-5 text-[#31435d]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#dce4ef] pt-4">
        <button
          type="button"
          onClick={() => navigate("/admin/post-job")}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#4f46e5] text-[15px] font-medium text-white shadow-sm transition hover:bg-[#4338ca]"
        >
          <PlusCircle className="h-5 w-5 fill-white text-[#4f46e5]" />
          Create New Job
        </button>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            className="flex h-10 w-full items-center gap-4 rounded-md px-4 text-left text-[15px] font-medium text-[#17233c]"
          >
            <CircleHelp className="h-5 w-5 fill-[#31435d] text-white" />
            Help Center
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-full items-center gap-4 rounded-md px-4 text-left text-[15px] font-medium text-[#17233c] hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5 text-[#31435d]" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
