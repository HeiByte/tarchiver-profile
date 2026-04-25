import { use } from "react";
import {FileType,Folder, Zap, Check} from "lucide-react";

const features = {
  "auto-naming": {
    title: "Automatic Naming",
    desc: "Every file follows a clear and predictable format. No manual renaming needed.",
    icon: FileType,
    color: "from-blue-500 to-cyan-400",
    how: [
      "System detects file type automatically",
      "Applies consistent naming rules",
      "Removes human error in naming",
    ],
    benefit: [
      "No duplicate file names",
      "Easier file search",
      "Consistent structure across project",
    ],
  },

  "flat-structure": {
    title: "Flat Structure",
    desc: "No deep folder trees. Just a clean, direct system that makes sense.",
    icon: Folder,
    color: "from-purple-500 to-pink-500",
    how: [
      "All files stored in a single logical layer",
      "No nested folder confusion",
      "Direct access system",
    ],
    benefit: ["Faster navigation", "Less cognitive load", "Easy maintenance"],
  },

  "instant-organization": {
    title: "Instant Organization",
    desc: "Upload your file, and the system takes care of the rest.",
    icon: Zap,
    color: "from-orange-500 to-yellow-400",
    how: [
      "File uploaded → system scans metadata",
      "Auto-categorization happens instantly",
      "Stored in correct structure",
    ],
    benefit: [
      "Zero manual sorting",
      "Instant file structure",
      "Time-saving workflow",
    ],
  },
};

export default function Page({ params }) {
  const { id } = use(params);
 const data = features[id];

if (!data) return <div>Feature not found</div>;

const Icon = data.icon;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-slate-50">
        <div className="text-6xl mb-6"></div>
        <h1 className="text-2xl font-bold text-slate-800">Feature not found</h1>
        <p className="text-slate-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
        >
          ← Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation - Top */}
        <nav className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-slate-500 transition-colors group"
          >
            <span className="mr-2 p-3 transform group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to Dashboard
          </a>
        </nav>

        {/* Header Card */}
        <header className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div
            className={`flex-shrink-0 w-24 h-24 rounded-3xl bg-gradient-to-br ${data.color} flex items-center justify-center text-5xl shadow-xl shadow-slate-200`}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {data.title}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              {data.desc}
            </p>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* How it Works Section */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              How it Works
            </h3>
            <ul className="space-y-5">
              {data.how.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-slate-600 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits  */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              Key Benefits
            </h3>
            <ul className="space-y-5">
              {data.benefit.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  {/* ICON PLACEHOLDER */}
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="w-3.5 h-3.5"/>
                  </div>
                  <span className="text-slate-600 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
