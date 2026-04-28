import { Button } from "@/components/ui/button";
import {
  Building2,
  User,
  ClipboardList,
  Briefcase,
  ArrowRight,
  BadgeCheck,
  Gauge,
  Grid2X2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/pexels-mart-production-8872411.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const companies = [
    "webflow",
    "slack",
    "Microsoft",
    "Google",
    "airbnb",
    "stripe",
  ];

  const recruiterFeatures = [
    {
      icon: BadgeCheck,
      title: "Vetted Talent Pool",
      text: "Skip the noise. Our proprietary verification process ensures you only see high-quality, relevant candidates.",
    },
    {
      icon: Grid2X2,
      title: "Effortless Management",
      text: "Integrated ATS features allow your team to collaborate, rate candidates, and move through the funnel seamlessly.",
    },
    {
      icon: Gauge,
      title: "Fast Hiring",
      text: "Reduce your time-to-hire by 40% with our automated screening and direct-to-candidate messaging tools.",
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative flex flex-col overflow-hidden bg-[#fbf8ff]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14 lg:py-20">
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find your next job or the perfect hire
            </h1>

            <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-500 sm:text-lg">
              The professional marketplace connecting world-class talent with
              industry-leading companies. Experience a smarter way to grow your
              career or scale your team.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => navigate("/jobs")}
                className="h-12 rounded-md bg-indigo-600 px-8 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              >
                I'm looking for a job
              </Button>
              <Button
                onClick={() => navigate("/Signup")}
                variant="outline"
                className="h-12 rounded-md border-slate-300 bg-white px-8 font-bold text-indigo-600 hover:bg-indigo-50"
              >
                I'm hiring
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Professionals working together in an office"
              className="h-[260px] w-full rounded-xl object-cover shadow-2xl shadow-slate-300/70 sm:h-[340px] lg:h-[360px]"
            />
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

      {/* Candidate section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14">
          <p className="mb-3 text-sm font-black text-indigo-600">
            For Candidates
          </p>
          <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
            Accelerate your career
          </h2>
        </div>
        <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14">
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
            <Button
              onClick={() => navigate("/Signup")}
              className="flex h-12 items-center gap-2 rounded-full bg-indigo-500 w-42 font-medium text-white hover:bg-indigo-600"
            >
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

      {/* Recruiters section */}
      <section className="bg-[#f3eefa] py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
          <div>
            <p className="mb-3 text-sm font-black text-[#b35b18]">
              For Recruiters
            </p>
            <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              Hire better, faster
            </h2>

            <div className="mt-9 space-y-7">
              {recruiterFeatures.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-[#b35b18]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden h-[360px] w-full max-w-[620px] sm:block">
            <div className="absolute left-[18%] top-10 w-[285px] rounded-lg bg-white p-3 shadow-lg shadow-slate-300/60">
              <img
                src={heroImage}
                alt="Recruiters reviewing a candidate"
                className="h-32 w-full rounded-md object-cover"
              />
              <div className="mt-4 h-4 w-4/5 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-1/2 rounded bg-slate-50" />
            </div>

            <div className="absolute right-0 top-0 w-[260px] rounded-lg bg-white p-4 shadow-lg shadow-slate-300/60">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="mt-3 h-3 w-4/5 rounded bg-slate-50" />
              <div className="mt-3 h-3 w-2/3 rounded bg-slate-50" />
            </div>

            <div className="absolute right-0 top-24 w-[260px] rounded-lg bg-white p-3 shadow-lg shadow-slate-300/60">
              <div className="flex h-40 items-center justify-center rounded-md bg-slate-900">
                <div className="relative h-20 w-20 rounded-full border-8 border-slate-700">
                  <div className="absolute inset-3 rounded-full border-8 border-cyan-400 border-t-transparent" />
                </div>
              </div>
              <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
            </div>

            <div className="absolute bottom-4 left-[18%] w-[285px] rounded-lg bg-indigo-700 p-5 shadow-lg shadow-indigo-300/70">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-indigo-300" />
                <div className="h-4 w-32 rounded bg-indigo-300" />
              </div>
              <div className="mt-6 h-2.5 w-full rounded bg-indigo-300" />
              <div className="mt-4 h-2.5 w-4/5 rounded bg-indigo-300" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-lg shadow-slate-300/60 sm:hidden">
            <img
              src={heroImage}
              alt="Recruiters reviewing a candidate"
              className="h-56 w-full rounded-md object-cover"
            />
            <div className="mt-4 rounded-lg bg-indigo-700 p-5">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-indigo-300" />
                <div className="h-4 w-32 rounded bg-indigo-300" />
              </div>
              <div className="mt-6 h-2.5 w-full rounded bg-indigo-300" />
              <div className="mt-4 h-2.5 w-4/5 rounded bg-indigo-300" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-8xl px-5 sm:px-10 lg:px-14">
          <div className="flex flex-col items-center justify-center gap-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-10 sm:p-16 text-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Join JobHunt Today
              </h2>
              <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto">
                Whether you're looking for your next challenge or building a world-class team, we have the tools you need to succeed.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/Signup")}
                className="h-12 px-8 rounded-lg bg-white text-indigo-600 font-bold text-base hover:bg-slate-100 shadow-lg"
              >
                Create a profile
              </Button>
              <Button
                onClick={() => navigate("/Signup")}
                className="h-12 px-8 rounded-lg bg-indigo-800 text-white font-bold text-base hover:bg-indigo-900 shadow-lg"
              >
                Start hiring
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
