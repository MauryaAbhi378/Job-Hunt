import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, setFilters } from "../../store/slice/jobSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const Filter = () => {
  const {
    filters = {},
    jobByText,
    page = 1,
    limit = 3,
    totalJob,
  } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs({ page, limit, jobByText, filters }));
  }, [filters, dispatch]);

  const clearAll = () => {
    dispatch(
      setFilters({
        jobType: [],
        salary: { min: 0, max: 0 },
        experienceLevel: { min: 0, max: 0 },
        freshness: "",
      })
    );
  };

  const handleCheckboxChange = (sectionKey, option) => {
    const currentValue = filters[sectionKey];

    let updatedValue;

    if (sectionKey === "jobType") {
      updatedValue = currentValue.includes(option.label)
        ? currentValue.filter((item) => item !== option.label)
        : [...currentValue, option.label];
    }

    if (sectionKey === "salary") {
      const isSameRange =
        currentValue.min === option.value.min &&
        currentValue.max === option.value.max;

      updatedValue = isSameRange ? { min: 0, max: 0 } : option.value;
    }

    dispatch(
      setFilters({
        ...filters,
        [sectionKey]: updatedValue,
      })
    );
  };

  const clearCategory = (category) => {
    let clearedValue;

    switch (category) {
      case "jobType":
        clearedValue = [];
        break;

      case "salary":
        clearedValue = { min: 0, max: 0 };
        break;

      case "experienceLevel":
        clearedValue = { min: 0, max: 0 };
        break;

      case "freshness":
        clearedValue = "";
        break;

      default:
        clearedValue = null;
    }

    dispatch(
      setFilters({
        ...filters,
        [category]: clearedValue,
      })
    );
  };

  const sections = [
    {
      title: "Freshness",
      key: "freshness",
      type: "select",
      options: [
        { label: "Last 1 day" },
        { label: "Last 7 day" },
        { label: "Last 15 days" },
        { label: "Last 30 days" },
      ],
    },
    {
      title: "Experience",
      key: "experienceLevel",
      type: "slider",
      range: [0, 30],
    },
    {
      title: "Job Type",
      key: "jobType",
      type: "checkbox",
      options: [
        { label: "Full Time" },
        { label: "Part Time" },
        { label: "Internship" },
        { label: "Freelance" },
      ],
    },
    {
      title: "Salary",
      key: "salary",
      type: "checkbox",
      options: [
        { label: "0K - 15K", value: { min: 0, max: 15000 } },
        { label: "15K - 40K", value: { min: 15000, max: 40000 } },
        { label: "40K - 100K", value: { min: 40000, max: 100000 } },
        { label: "100K - 150K", value: { min: 100000, max: 150000 } },
      ],
    },
  ];

  return (
    <div className="w-72 bg-white p-4 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Filters</h2>
        <div className="flex flex-col items-center">
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:underline cursor-pointer"
          >
            Clear All
          </button>
          <p className="text-gray-600 text-xs font-semibold">{totalJob}</p>
        </div>
      </div>

      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{section.title}</h3>
              <div>
                <button
                  onClick={() => clearCategory(section.key)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {section.type === "select" && (
                <Select
                  value={filters[section.key] || ""}
                  onValueChange={(val) =>
                    dispatch(
                      setFilters({
                        ...filters,
                        [section.key]: val,
                      })
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {section.options.map((option, i) => (
                      <SelectItem key={i} value={option.label}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {section.type === "slider" && (
                <div className="px-2 relative">
                  <div className="relative w-full">
                    <Slider
                      min={section.range[0]}
                      max={section.range[1]}
                      step={1}
                      value={[filters.experienceLevel?.max || 0]}
                      onValueChange={(val) =>
                        dispatch(
                          setFilters({
                            ...filters,
                            experienceLevel: { min: val[0], max: val[0] },
                          })
                        )
                      }
                      className="mt-8"
                    />

                    {/* Bubble above thumb */}
                    <div
                      className="absolute -top-8 flex justify-center items-center w-8 h-8 rounded-full bg-black text-white text-sm"
                      style={{
                        left: `calc(${
                          ((filters.experienceLevel?.min - section.range[0]) /
                            (section.range[1] - section.range[0])) *
                          100
                        }% - 10px)`,
                      }}
                    >
                      {filters.experienceLevel?.max}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{section.range[0]} Yrs</span>
                    <span>{section.range[1]} Yrs</span>
                  </div>
                </div>
              )}

              {section.type === "checkbox" &&
                section.options.map((option, i) => {
                  let checked = false;

                  if (section.key === "jobType") {
                    checked = filters.jobType.includes(option.label);
                  }

                  if (section.key === "salary") {
                    checked =
                      filters.salary.min === option.value.min &&
                      filters.salary.max === option.value.max;
                  }

                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={option.label}
                          checked={checked}
                          onCheckedChange={() =>
                            handleCheckboxChange(section.key, option)
                          }
                        />
                        <Label htmlFor={option.label}>{option.label}</Label>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {idx !== sections.length - 1 && (
            <hr className="my-3 border-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Filter;
