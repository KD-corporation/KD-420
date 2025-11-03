"use client";

import { useState, useEffect } from "react";
import { User, Github, Linkedin, Link2, Save, X, Plus, Trash2, ArrowLeft } from "lucide-react";

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
    FirstName: "John",
    LastName: "Doe",
    Username: "johndoe_sql",
    email: "john.doe@example.com",
    githubUrl: "https://github.com/johndoe",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    websiteUrl: "https://johndoe.dev",
    skills: ["Python", "SQL", "JavaScript"]
  });

  const [formData, setFormData] = useState({
    Username: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    skills: [] as string[]
  });

  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Load user data
    setFormData({
      Username: user.Username,
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      websiteUrl: user.websiteUrl || "",
      skills: user.skills || []
    });
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSearchTerm("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !formData.skills.includes(skill)
  );

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data
    setUser(prev => ({
      ...prev,
      Username: formData.Username,
      githubUrl: formData.githubUrl,
      linkedinUrl: formData.linkedinUrl,
      websiteUrl: formData.websiteUrl,
      skills: formData.skills
    }));

    setIsSaving(false);
    setSuccessMessage("Profile updated successfully!");
    
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const isFormValid = formData.Username.trim().length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your profile information and skills</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          
          {/* Read-only Fields */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="text-sm text-gray-400 mb-4">These fields cannot be changed</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  value={user.FirstName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  value={user.LastName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <input
                  type="text"
                  value={formData.Username}
                  onChange={(e) => handleInputChange("Username", e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
                {formData.Username.trim().length < 3 && formData.Username.length > 0 && (
                  <p className="text-red-400 text-sm mt-1">Username must be at least 3 characters</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            
            {/* Selected Skills */}
            <div className="mb-4">
              {formData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-3 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet</p>
              )}
            </div>

            {/* Add Skill */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Add Skills</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSkillDropdown(true);
                }}
                onFocus={() => setShowSkillDropdown(true)}
                placeholder="Search and add skills..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
              
              {/* Dropdown */}
              {showSkillDropdown && filteredSkills.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredSkills.map((skill, idx) => (
                    <button
                      key={idx}
                      onClick={() => addSkill(skill)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-emerald-500" />
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Popular Skills */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {["Python", "JavaScript", "SQL", "React", "Node.js", "Docker"].map((skill) => (
                  !formData.skills.includes(skill) && (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded-full text-sm transition-colors"
                    >
                      + {skill}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                setFormData({
                  Username: user.Username,
                  githubUrl: user.githubUrl || "",
                  linkedinUrl: user.linkedinUrl || "",
                  websiteUrl: user.websiteUrl || "",
                  skills: user.skills || []
                });
              }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}