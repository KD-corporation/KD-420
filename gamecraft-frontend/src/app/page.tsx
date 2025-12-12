import Image from "next/image";
import HeroSection from "./components/heroSection";
import MySQLHeroSection from "./components/hero";
import SqlQuestions from "./components/QuestionFormates/All-question";
import SQLGameUI from "./Game/module1/page";
import Module2 from "./Game/module1/level2"
import Footer from "./components/footer";
export default function Home() {
  const x = process.env.NEXT_PUBLIC_TEST;
  console.log("Home page rendered", x);
  return (
    <div className="bg-black">
      <MySQLHeroSection />
      
      {/* <SQLGameUI /> */}
      {/* <Module1 /> */}
      <Module2 />
      <SqlQuestions />
      <HeroSection />
      <Footer />
    </div>
  );
}
