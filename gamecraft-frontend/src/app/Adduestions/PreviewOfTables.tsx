"use client";

import React, { useEffect, useState } from "react";

interface TablesPreviewResponse {
  message: string;
  status: boolean;
  data: Record<string, any[]>;
}

export default function TablesPreview() {
  const [tables, setTables] = useState<Record<string, any[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

    async function fetchPreview() {
      try {
        const res = await fetch(`${BaseUrl}/getapis/get-all-tables-preview`);
        const json: TablesPreviewResponse = await res.json();

        if (json.status) {
          setTables(json.data);
        } else {
          setError(json.message || "Failed to fetch table previews");
        }
      } catch (err) {
        setError("Network error while fetching tables preview");
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Database Tables Preview</h1>

      {loading && <p className="text-slate-400">Loading tables...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {tables && (
        <div className="space-y-8">
          {Object.keys(tables).map((table) => (
            <div key={table} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
              <h2 className="text-xl font-semibold mb-3 capitalize">{table}</h2>

              {tables[table].length === 0 ? (
                <p className="text-slate-400">No data available</p>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full border border-slate-700">
                    <thead>
                      <tr className="bg-slate-700">
                        {Object.keys(tables[table][0]).map((col) => (
                          <th key={col} className="px-4 py-2 border border-slate-600 text-left capitalize">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tables[table].map((row, idx) => (
                        <tr key={idx} className="even:bg-slate-800 odd:bg-slate-900">
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-4 py-2 border border-slate-700 text-sm">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
