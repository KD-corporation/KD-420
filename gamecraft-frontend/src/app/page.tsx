import Image from "next/image";
import HeroSection from "./components/heroSection";
import MySQLHeroSection from "./components/hero";

export default function Home() {
  const x = process.env.NEXT_PUBLIC_TEST;
  console.log("Home page rendered", x);
  return (
    <div className="bg-black">
      <MySQLHeroSection />
      <HeroSection />
    </div>
  );
}
