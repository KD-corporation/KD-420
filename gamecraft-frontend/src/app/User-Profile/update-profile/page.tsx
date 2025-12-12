"use client";

import { useState, useEffect } from "react";
import {
  User,
  Github,
  Linkedin,
  Link2,
  Save,
  X,
  Plus,
  ArrowLeft,
} from "lucide-react";

interface UserData {
  FirstName: string;
  LastName: string;
  Username: string;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  skills?: string[];
}

const availableSkills = [
  "C++", "C", "Java", "Python", "JavaScript", "TypeScript",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "React", "Node.js",
  "Express", "Django", "Flask", "Spring Boot", "HTML", "CSS",
  "Tailwind CSS", "Git", "Docker", "Kubernetes", "AWS", "Azure"
];

export default function EditProfilePage() {
  const [user, setUser] = useState<UserData>({
    FirstName: "",
    LastName: "",
    Username: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    skills: []
  });

  const [formData, setFormData] = useState({
    Username: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    skills: [] as string[],
    phoneNumber: "",
  });

  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setFormData({
      Username: user.Username,
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      websiteUrl: user.websiteUrl || "",
      skills: user.skills || [],
      phoneNumber: "",
    });
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setSearchTerm("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

  const handleSave = async () => {
    setIsSaving(true);

    const stored = localStorage.getItem("userData");
    const email = JSON.parse(stored || "{}").email;
    const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

    const payload = {
      email,
      username: formData.Username,
      githubUrl: formData.githubUrl || "",
      linkedinUrl: formData.linkedinUrl || "",
      websiteUrl: formData.websiteUrl || "",
      skills: formData.skills || [],
      phoneNumber: formData.phoneNumber || "",
    };

    try {
      const response = await fetch(
        `${BaseUrl}/apis/update-user-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Update Response:", data);

      if (!response.ok || !data.status) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser((prev) => ({
        ...prev!,
        Username: formData.Username,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        websiteUrl: formData.websiteUrl,
        skills: formData.skills,
      }));

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile: " + err);
    }

    setIsSaving(false);
  };

  const isFormValid = formData.Username.trim().length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>

          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your profile information and skills</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">

          {/* ACCOUNT INFO */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="text-sm text-gray-400 mb-4">These fields cannot be changed</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">First Name</label>
                <input
                  type="text"
                  value={user.FirstName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Last Name</label>
                <input
                  type="text"
                  value={user.LastName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* EDITABLE FIELDS */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>

            <div className="space-y-4">
              {/* USERNAME */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> Username
                </label>

                <input
                  value={formData.Username}
                  onChange={(e) =>
                    handleInputChange("Username", e.target.value)
                  }
                  className="w-full mt-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>

              {/* GITHUB */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub URL
                </label>

                <input
                  value={formData.githubUrl}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  className="w-full mt-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>

              {/* LINKEDIN */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn URL
                </label>

                <input
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  className="w-full mt-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>

              {/* WEBSITE */}
              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Website URL
                </label>

                <input
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    handleInputChange("websiteUrl", e.target.value)
                  }
                  className="w-full mt-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-600 px-3 py-2 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative">
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSkillDropdown(true);
                }}
                placeholder="Search skills..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
              />

              {showSkillDropdown && filteredSkills.length > 0 && (
                <div className="absolute w-full bg-gray-900 border border-gray-700 rounded-lg mt-2 max-h-60 overflow-y-auto z-10">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-800"
                      onClick={() => addSkill(skill)}
                    >
                      <Plus className="inline w-4 h-4 mr-2 text-emerald-500" />
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg text-white font-semibold"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() =>
                setFormData({
                  Username: user.Username,
                  githubUrl: user.githubUrl || "",
                  linkedinUrl: user.linkedinUrl || "",
                  websiteUrl: user.websiteUrl || "",
                  skills: user.skills || [],
                  phoneNumber: "",
                })
              }
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
