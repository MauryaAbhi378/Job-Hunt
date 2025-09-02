import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const reviews = [
  {
    id: 1,
    company: "Mailchimp",
    text: "I can't thank JobSearchPro enough for connecting me with the perfect software engineering job. The job matching algorithm is spot on, and the job alerts kept me updated on new opportunities. It's a game-changer for anyone in the tech industry.",
    name: "Ibrahim Hamza",
    role: "Product Designer",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    company: "Google",
    text: "JobSearchPro helped me land my dream job in data science. The alerts were timely, and the algorithm suggested the exact roles I was looking for.",
    name: "Sophia Lee",
    role: "Data Scientist",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    company: "Microsoft",
    text: "Amazing platform! The matching is great and I never miss new opportunities anymore.",
    name: "Arjun Mehta",
    role: "Software Engineer",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    company: "Amazon",
    text: "Super easy to use, and the recommendations are always relevant. Landed my first tech role thanks to it.",
    name: "Neha Sharma",
    role: "Frontend Developer",
    img: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

export default function ReviewCarousel() {
  const [index, setIndex] = useState(0);

  const nextReview = () => {
    if (index < reviews.length - 1) {
      setIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevReview = () => {
    if (index > 0) {
      setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const visibleReviews = [
    reviews[index],
    reviews[(index + 1) % reviews.length],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-semibold w-80 leading-snug">
            Review of People Who Have Found Jobs
          </h2>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full hover:bg-gray-300 ${
                index > 0 ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onClick={prevReview}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full hover:bg-gray-300 ${
                index < reviews.length - 1
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={nextReview}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {visibleReviews.map((review) => (
            <Card
              key={review.id}
              className="w-[300px] h-[250px] shadow-lg rounded-2xl flex-shrink-0"
            >
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{review.company}</h3>
                <p className="text-sm text-gray-600 italic mb-4 line-clamp-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
