import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import marketing from "../../assets/marketing.png";
import coding from "../../assets/coding.png";
import ux from "../../assets/uxdesign.png";
import finance from "../../assets/finance.png";
import server from "../../assets/server.png";
import briefcase from "../../assets/briefcase.png";
import ai from "../../assets/ai.png";
import hr from "../../assets/hr.png";

const JobsByCategory = () => {
  const {
    jobs = [],
  } = useSelector((store) => store.job);
  const [counts, setCounts] = useState({});
  const category = [
    {
      title: "Marketing",
      icon: marketing,
    },
    {
      title: "Developer",
      icon: coding,
    },
    {
      title: "UI/UX",
      icon: ux,
    },
    {
      title: "Finance",
      icon: finance,
    },
    {
      title: "Cloud",
      icon: server,
    },
    {
      title: "Business",
      icon: briefcase,
    },
    {
      title: "AI",
      icon: ai,
    },
    {
      title: "Human Resource",
      icon: hr,
    },
  ];

  useEffect(() => {
    let countMap = jobs.reduce((acc, job) => {
      const cat = job?.category;
      if (cat) {
        acc[cat] = (acc[cat] || 0) + 1;
      }
      return acc;
    }, {});

    const newCount = category.reduce((acc, cat) => {
      acc[cat.title] = countMap[cat.title || 0];
      return acc;
    }, {});

    setCounts(newCount);
  }, [jobs]);

  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-7xl mx-auto py-5">
        <h1 className="text-3xl font-semibold mb-3">
          One Platform Many Solutions
        </h1>
        <div className="grid grid-cols-4 gap-6 mt-5">
          {category.map((cat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between w-72 px-4 py-3 rounded-full shadow-sm  transition bg-white text-gray-700 border hover:bg-blue-200 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full flex items-center justify-center transition bg-gray-100 text-gray-600">
                  <img src={cat.icon} alt={cat.title} className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{cat.title}</p>
                  <p className="text-sm text-gray-600 group-hover:text-gray-300">
                    {counts[cat.title] || 0} Jobs Available
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsByCategory;
