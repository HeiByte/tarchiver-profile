import Link from "next/link";
export default function Hero() {
  return (
    <section className="bg-primary text-white py-24 md:py-32 px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Your Files. <span className="text-secondary italic">Finally</span> Under Control.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Tarchiver Lite eliminates messy folders and inconsistent naming by enforcing structure automatically. No more guessing. No more clutter.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-5">

          <Link href="/login">
          <button className="bg-secondary text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-secondary/10">
            Get Started
          </button>
          </Link>
          <button className="border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-all">
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}