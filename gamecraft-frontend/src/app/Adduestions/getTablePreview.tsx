"use client"

import { useState } from "react";
import axios from "axios";

export default function CreateTableForm() {
  const [formData, setFormData] = useState({
    title: "",
    owner: "",
    description: "",
    query: ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createTable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await axios.post(
        "http://localhost:8080/create-table",   // your backend endpoint
        formData
      );

      setMsg(response.data.message || "Table created successfully!");
    } catch (error) {
      setMsg(error?.response?.data?.message || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Create New Table</h2>

      {msg && (
        <div className="mb-3 text-sm p-2 rounded bg-blue-100 text-blue-700">
          {msg}
        </div>
      )}

      <form onSubmit={createTable} className="space-y-4">
        
        {/* Table Name */}
        <div>
          <label className="block font-medium text-gray-700">Table Name</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded-md"
            placeholder="Enter table name"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Owner */}
        <div>
          <label className="block font-medium text-gray-700">Owner</label>
          <input
            type="text"
            name="owner"
            className="w-full p-2 border rounded-md"
            placeholder="Admin / User"
            value={formData.owner}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="2"
            className="w-full p-2 border rounded-md"
            placeholder="Short description about table"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* SQL Query */}
        <div>
          <label className="block font-medium text-gray-700">SQL Query</label>
          <textarea
            name="query"
            rows="5"
            className="w-full p-2 border rounded-md font-mono text-sm"
            placeholder="CREATE TABLE example (id INT PRIMARY KEY...);"
            value={formData.query}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          {loading ? "Creating..." : "Create Table"}
        </button>
      </form>
    </div>
  );
}
