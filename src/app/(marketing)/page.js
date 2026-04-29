import Hero from "@/components/home/Hero";
import CoreValue from "@/components/home/CoreValue";
import Features from "@/components/home/Features";
import Closing from "@/components/home/Closing";


export default function Home() {
  return (
    <main className="bg-background">
      <Hero></Hero>
      <CoreValue></CoreValue>
      <Features></Features>
      <Closing></Closing>
    </main>
  );
}