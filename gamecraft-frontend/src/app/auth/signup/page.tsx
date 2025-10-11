"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Github,
    Linkedin,
    Youtube,
    Facebook,
    Send,
} from "lucide-react";

import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";


gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cnfpassword: "",
        countrycode: "",
        contact: "",
        message: "",
    });

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const socialRef = useRef<HTMLDivElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current || !socialRef.current || !formRef.current) return;

        const ctx = gsap.context(() => {
            // Section fade in
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            });

            // Social panel slide in from left
            gsap.from(socialRef.current, {
                x: -100,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            // Form slide in from right
            gsap.from(formRef.current, {
                x: 100,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setFormData({ name: "", email: "", message: "", password: "", cnfpassword: "", countrycode: "", contact: "+91" });
    };

    console.log("form data is here", formData);

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative w-full min-h-screen bg-gradient-to-b from-black via-[#0B0F18] to-black text-red-500 flex flex-col justify-center overflow-hidden px-6 py-20"
        >
            {/* Red Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-700/30 blur-[120px] w-2/3 h-64 rounded-full"></div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide text-center mb-12">
                SignUp
            </h1>

            <div className="relative z-10 flex flex-col md:flex-row items-start justify-center gap-10 lg:px-16">
                {/* Social Media */}
                <div
                    ref={socialRef}
                    className="w-full md:w-1/2 bg-gray-900 border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-xl p-8"
                >
                    <h3 className="text-2xl font-semibold mb-6 text-red-400">
                        My Social Media
                    </h3>

                    <div className="flex flex-col gap-3 text-lg">
                        {[
                            { icon: Github, name: "Github", link: "#" },
                            { icon: Linkedin, name: "LinkedIn", link: "#" },
                            { icon: Youtube, name: "YouTube", link: "#" },
                            { icon: Facebook, name: "Facebook", link: "#" },
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.link}
                                className="flex items-center gap-3 p-3 border border-transparent hover:border-red-500/40 rounded-md transition-all duration-300 hover:bg-red-600/20 hover:text-white"
                            >
                                <social.icon className="w-6 h-6 text-red-400" />
                                {social.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="w-full md:w-1/2 bg-gray-900/90 border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-xl p-8 text-white"
                >
                    <h2 className="text-2xl font-semibold text-red-400 mb-5">
                        Sign Up Here
                    </h2>

                    {/* Name */}
                    <div className="flex flex-col mb-4">
                        <label htmlFor="name" className="mb-1 text-sm text-red-400">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-red-400 placeholder-gray-500"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col mb-4">
                        <label htmlFor="email" className="mb-1 text-sm text-red-400">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-red-400 placeholder-gray-500"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="email" className="mb-1 text-sm text-red-400">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="strong password"
                            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-red-400 placeholder-gray-500"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="email" className="mb-1 text-sm text-red-400">
                            Password
                        </label>
                        <input
                            id="cnfpassword"
                            type="password"
                            value={formData.cnfpassword}
                            onChange={handleChange}
                            placeholder="strong password"
                            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-red-400 placeholder-gray-500"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="contact" className="mb-1 text-sm text-red-400">
                            Contact Number
                        </label>
                        <PhoneInput 
                            country={"in"}
                            value={formData.contact}
                            onChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    contact: value,
                                }))
                            }
                            inputProps={{
                                name: "phone",
                                required: true,
                                autoFocus: false,
                            }}
                            containerClass="!w-full"
                            inputClass="!w-full !bg-gray-800 !text-red-400 !border-gray-700 !focus:border-red-500 !focus:ring-1 !focus:ring-red-500 !outline-none !rounded-md !py-2"
                            buttonClass="!bg-gray-900 !border-gray-700 !hover:bg-red-600/30 !rounded-l-md"
                            dropdownClass="!bg-gray-800 !text-red-400"
                            placeholder="7295976697"
                        />
                    </div>

                    {/* Message */}


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300"
                    >
                        Sign Up <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </section>
    );
}
