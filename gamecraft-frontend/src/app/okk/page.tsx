"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ActivityDay {
  date: string;
  count: number;
}

function UserActivityContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "gk022135@gmail.com";
  const [data, setData] = useState<ActivityDay[]>([]);
  const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${BaseUrl}/getapis/getuser-activity?email=${email}`)
      .then((res) => res.json())
      .then(setData);
  }, [email, BaseUrl]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Activity Heatmap for {email}
      </h1>

      <CalendarHeatmap data={data} />
    </div>
  );
}

export default function UserActivityPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <UserActivityContent />
    </Suspense>
  );
}

// ---------------- COMPONENT -------------------

function CalendarHeatmap({ data }: { data: ActivityDay[] }) {
  const today = new Date();
  const daysBack = 365;
  const days: { date: string; count: number }[] = [];

  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const iso = d.toISOString().split("T")[0];
    const record = data.find((x) => x.date === iso);

    days.push({
      date: iso,
      count: record ? record.count : 0,
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {days.reverse().map((day) => (
        <div
          key={day.date}
          title={`${day.date}: ${day.count}`}
          className={`
            w-3 h-3 rounded 
            ${day.count === 0 ? "bg-gray-200" : ""}
            ${day.count === 1 ? "bg-green-200" : ""}
            ${day.count === 2 ? "bg-green-400" : ""}
            ${day.count >= 3 ? "bg-green-600" : ""}
          `}
        ></div>
      ))}
    </div>
  );
}
