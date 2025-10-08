"use client";

import start3d from "@/app/assets/Star3d.webp";
import Assians from "@/app/assets/Assians.webp";
import Astronaut from "@/app/assets/astronaut.png";
import Moon from "@/app/assets/Image-2.png";
import Spine from "@/app/assets/spine.webp";
import Nature from "@/app/assets/Image-9.png";
import KarateGirl from "@/app/assets/karategirl.webp";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const box3Ref = useRef<HTMLDivElement>(null);

    // Run animations after component mounts
    useGSAP(
        () => {
            // Animate Section 1 images
            const boxes = gsap.utils.toArray(".firstBox img") as HTMLElement[];

            timelineRef.current = gsap
                .timeline({ repeat: -1, yoyo: true })
                .to(boxes[0], { rotation: 360, duration: 3, ease: "power1.inOut" })
                .to(boxes[1], { x: 120, rotation: -360, duration: 3 }, "<")
                .to(boxes[2], { y: -50, scale: 1.2, duration: 2 }, "<")
                .to(boxes[3], { opacity: 0.5, duration: 2 }, "<");

            // Animate Section 2 clip-path



            gsap.fromTo(
                ".section2",
                {
                    clipPath:
                        // Rectangle shape (8 points for smooth morphing)
                        "polygon(0% 0%, 100% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)",
                    rotate: 0,
                    scale: 0.95,
                },
                {
                    clipPath:
                        // Hexagon with same number of points (8)
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    scale: 1.5,
                    duration: 3,
                    ease: "power2.inOut",
                }
            );

            const tl = gsap.timeline({ defaults: { ease: "power1.inOut", duration: 1.5 } });

            tl.fromTo(".slideShow h1:nth-child(1)", { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(".slideShow h1:nth-child(2)", { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(".slideShow h1:nth-child(3)", { x: -50, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(".slideShow p", { x: -50, opacity: 0 }, { x: 0, opacity: 1 }

                );


            gsap.to(".ImgRotation img", {
                rotationY: (index) => (index % 2 === 0 ? 180 : 0),
                duration: 2.5,
                ease: "power2.inOut",
                transformOrigin: "center center",
            });




        }

    );

    return (
        <div ref={containerRef} className="overflow-hidden">
            {/* Section 1 */}
            <div className="firstBox bg-amber-50 w-screen text-center relative p-8">
                <h1 className="z-10 text-6xl text-black antialiased font-bold mb-4">
                    Welcome to SQL Gaming World
                </h1>
                <div className="relative flex justify-center gap-4">
                    <img src={start3d.src} className="w-[200px] h-[200px]" alt="star" />
                    <img src={Moon.src} className="w-[200px] h-[200px]" alt="moon" />
                    <img src={Astronaut.src} className="w-[200px] h-[200px]" alt="astronaut" />
                    <img src={Spine.src} className="w-[200px] h-[200px]" alt="spine" />
                </div>
                <p className="text-black/60 mt-6 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, eius
                    et sed aperiam aspernatur corrupti. Nesciunt quas voluptatibus iure,
                    soluta, dolore deleniti voluptate nulla nam esse dicta delectus sed ab
                    ad eveniet ipsam ipsa libero.
                </p>
                <img src={Assians.src} className="w-full mt-8" alt="Assians" />
            </div>

            {/* Section 2 */}
            <div className="box2 flex justify-around items-center p-10 bg-gray-100 w-screen h-[800px]">
                <div>

                    <h2 className="text-black text-6xl font-bold mb-4">Nature Transformation</h2>
                    <p className="text-gray-600 max-w-md">
                        Watch the image transform using GSAP’s clip-path animation.
                    </p>

                    <div className="slideShow max-w-lg relative">
                        <h1 className="text-3xl font-bold mb-4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </h1>
                        <h1 className="text-purple-600 font-bold text-4xl">
                            hi there everything is fine how are things going on bro
                        </h1>
                        <h1 className="text-green-600 font-bold text-3xl">
                            everything will be ok don’t worry about it okk!
                        </h1>
                        <p className="text-gray-700">
                            Ducimus rerum reprehenderit, autem, quibusdam qui repellendus et eius
                            in fugit voluptates tenetur id obcaecati laboriosam expedita.
                        </p>
                    </div>
                </div>
                <div>
                    <img
                        src={Nature.src}
                        className="section2 w-[600px] rounded-2xl"
                        alt="Nature"
                    />
                </div>
            </div>

            {/* Section 3 */}
            <div className="box3 flex justify-around items-center p-10" ref={box3Ref}>
                <div className="slideShow max-w-lg relative">
                    <h1 className="text-3xl font-bold mb-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </h1>
                    <h1 className="text-purple-600 font-bold text-4xl">
                        hi there everything is fine how are things going on bro
                    </h1>
                    <h1 className="text-green-600 font-bold text-3xl">
                        everything will be ok don’t worry about it okk!
                    </h1>
                    <p className="text-gray-700">
                        Ducimus rerum reprehenderit, autem, quibusdam qui repellendus et eius
                        in fugit voluptates tenetur id obcaecati laboriosam expedita.
                    </p>
                </div>

                <div className="flex gap-6 ImgRotation">
                    <img src={KarateGirl.src} className="w-[200px]" alt="Karate Girl" />
                    <img src={Astronaut.src} className="w-[200px]" alt="Astronaut" />
                </div>
            </div>
        </div>
    );
}
