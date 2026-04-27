import LatestJob from "./LatestJob";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Search, User, ClipboardList, Briefcase, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearPage, fetchJobs, setJobByText } from "../../store/slice/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const {
    jobByText,
    filters,
    page = 1,
    limit = 3,
  } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchHandler = () => {
    if (page > 1) {
      dispatch(clearPage());
    }

    dispatch(
      fetchJobs({ page: page > 1 ? 1 : page, limit, jobByText, filters }),
    );
    
    navigate('/jobs');
  };

  const companies = [
    "webflow",
    "slack",
    "Microsoft",
    "Google",
    "airbnb",
    "stripe",
  ];

  return (
    <div className="bg-white">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(99,102,241,0.12),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(45,212,191,0.14),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f7f8ff_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:px-10 lg:px-14">
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-16 text-center sm:py-20">
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Find <span className="text-emerald-500">your</span> next job
                opportunity or{" "}
                <span className="relative inline-block border-2 border-indigo-400 px-2">
                  discover
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-indigo-400" />
                  <span className="absolute -left-1 -top-1 h-2 w-2 bg-indigo-400" />
                </span>{" "}
                <span className="inline-block -rotate-6 rounded-full bg-[#f7c4aa] px-4 pb-2 pt-1 text-slate-950">
                  qualified
                </span>{" "}
                talents
              </h1>

              <div className="mt-9 flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-indigo-100 sm:flex-row sm:items-center sm:rounded-full">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <Search className="h-5 w-5 shrink-0 text-indigo-500" />
                  <Input
                    type="text"
                    value={jobByText.keyword}
                    onChange={(e) =>
                      dispatch(
                        setJobByText({
                          field: "keyword",
                          value: e.target.value,
                        }),
                      )
                    }
                    placeholder="Job title or keyword"
                    className="h-11 border-none px-0 text-slate-700 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <MapPin className="h-5 w-5 shrink-0 text-indigo-500" />
                  <Input
                    type="text"
                    value={jobByText.location}
                    onChange={(e) =>
                      dispatch(
                        setJobByText({
                          field: "location",
                          value: e.target.value,
                        }),
                      )
                    }
                    placeholder="Enter city"
                    className="h-11 border-none px-0 text-slate-700 shadow-none focus-visible:ring-0"
                  />
                </div>

                <Button
                  onClick={searchHandler}
                  className="h-12 rounded-full bg-indigo-500 px-7 font-bold text-white hover:bg-indigo-600"
                >
                  Search
                </Button>
              </div>
            </div>
        </div>

        <div className="w-full bg-indigo-100">
          <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-5 px-6 py-8 text-center text-2xl font-black text-slate-950 sm:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => (
              <div
                key={company}
                className="flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Building2 className="h-5 w-5" />
                <span>{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold tracking-widest text-[#d89f8a] uppercase">
              How it works
            </p>
            <p className="text-lg text-slate-600">
              We connect talented professionals with leading companies looking to
              hire. Whether you're searching for your dream job or seeking the
              perfect candidate
            </p>
          </div>

          <div className="relative mx-auto mt-20 mb-16 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
            {/* Connecting line 1 */}
            <div className="absolute left-[22%] top-12 z-0 hidden w-[22%] items-center justify-between md:flex">
              <div className="h-2 w-2 rounded-full bg-slate-900"></div>
              <div className="mx-2 flex-1 border-t-[3px] border-dashed border-slate-200"></div>
              <div className="h-2 w-2 rounded-full bg-slate-900"></div>
            </div>

            {/* Connecting line 2 */}
            <div className="absolute right-[22%] top-12 z-0 hidden w-[22%] items-center justify-between md:flex">
              <div className="h-2 w-2 rounded-full bg-slate-900"></div>
              <div className="mx-2 flex-1 border-t-[3px] border-dashed border-slate-200"></div>
              <div className="h-2 w-2 rounded-full bg-slate-900"></div>
            </div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-dashed border-slate-400 bg-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                  <User className="h-6 w-6 text-slate-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Register Your Account
              </h3>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-slate-400 bg-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Fill Out Your Resume
              </h3>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-24 w-24 rotate-45 items-center justify-center rounded-2xl border-2 border-dashed border-slate-400 bg-white">
                <div className="flex h-12 w-12 -rotate-45 items-center justify-center rounded-xl bg-indigo-50">
                  <Briefcase className="h-6 w-6 text-slate-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Find Your Job
              </h3>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button onClick={() => navigate("/Signup")} className="flex h-12 items-center gap-2 rounded-full bg-indigo-500 w-42 font-medium text-white hover:bg-indigo-600">
              Create a profile <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/jobs")}
              variant="outline"
              className="h-12 rounded-full border-2 border-indigo-500 px-8 font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Explore our jobs
            </Button>
          </div>
        </div>
      </section>

      <LatestJob />

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2.5rem] bg-slate-50 p-10 md:p-14 border border-slate-200 shadow-sm">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                Ready to start your journey?
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto md:mx-0">
                Join over 8,000 professionals who found their dream job through JobHunt.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 mt-6 md:mt-0">
              <Button className="h-14 px-8 rounded-2xl bg-blue-500 hover:bg-blue-600 text-slate-900 font-bold text-base shadow-sm">
                Get Started Now
              </Button>
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2  bg-white text-slate-700 hover:bg-slate-50 font-bold text-base">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
