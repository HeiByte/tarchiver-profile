export default function CoreValue() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl text-slate-500 font-medium mb-6">
          Most file systems depend on user discipline.
        </h2>
        <div className="relative inline-block mb-10">
          <span className="text-5xl md:text-7xl font-black text-primary relative z-10">
            That’s the problem.
          </span>
          <div className="absolute -bottom-2 left-0 w-full h-4 bg-secondary/30 -z-0"></div>
        </div>
        <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
          Tarchiver Lite removes that dependency by applying consistent rules behind the scenes so your files stay organized, <span className="font-semibold text-primary">without extra effort.</span>
        </p>
      </div>
    </section>
  );
}