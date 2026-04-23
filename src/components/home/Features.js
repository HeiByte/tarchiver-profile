const features = [
  { title: "Automatic Naming", desc: "Every file follows a clear and predictable format no manual renaming needed." },
  { title: "Flat Structure", desc: "No deep folder trees. Just a clean, direct system that makes sense." },
  { title: "Instant Organization", desc: "Upload your file, and the system takes care of the rest." }
];

export default function Features() {
  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <div key={i} className="group bg-white p-10 rounded-3xl border border-slate-100 hover:border-hover hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
            <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center mb-8 font-bold text-xl group-hover:rotate-6 transition-transform">
              0{i + 1}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-primary leading-tight">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}