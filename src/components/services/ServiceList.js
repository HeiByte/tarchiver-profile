import ServiceCard from "./ServiceCard";
import { Folder, Settings, Compass, Search, TrendingUp } from "lucide-react";

const services = [
  {
    title: "Structured File Management",
    desc: "A system that keeps your files organized by design, not by habit.",
    icon: Folder,
  },
  {
    title: "Automated Organization",
    desc: "Rules are applied consistently, removing the need for repetitive actions.",
    icon: Settings,
  },
  {
    title: "Clarity Over Complexity",
    desc: "A simplified structure that prioritizes usability over flexibility.",
    icon: Compass,
  },
  {
    title: "Reliable File Access",
    desc: "Find what you need without digging through layers of folders.",
    icon: Search,
  },
  {
    title: "A System That Scales With You",
    desc: "Built to remain effective as your files grow.",
    icon: TrendingUp,
  },
];

export default function ServiceList() {
  return (
    <section className="bg-primary py-24 md: px-10">
      <div className="max-w-6xl mx-auto grid">
        {/* Heading */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-center">
            Your Files,{" "}
            <span className="text-secondary italic">Our Responsibility</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              title={service.title}
              desc={service.desc}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
