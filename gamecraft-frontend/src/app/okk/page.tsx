"use client";

import { env } from "process";
import { useEffect, useState } from "react";

interface ActivityDay {
  date: string;
  count: number;
}

export default function UserActivityPage({ params }: { params: { email: string } }) {
  const [data, setData] = useState<ActivityDay[]>([]);
 const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${BaseUrl}/getapis/getuser-activity?email=gk022135@gmail.com`)
      .then(res => res.json())
      .then(setData);
  }, [params.email]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Activity Heatmap for {params.email}
      </h1>

      <CalendarHeatmap data={data} />
    </div>
  );
}


// ---------------- COMPONENT -------------------

function CalendarHeatmap({ data }: { data: ActivityDay[] }) {
  const today = new Date();
  const daysBack = 365;
  const days: { date: string; count: number }[] = [];

  // Create last 365 days
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
    <div className="grid grid-cols-53 gap-1">
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
