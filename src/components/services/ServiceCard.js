export default function ServiceCard({ title, desc, icon: Icon }) {
  return (
    <div className="group bg-white/5 border border-white/20 p-8 rounded-3xl hover:bg-white/10 hover:shadow-2xl hover:border-secondary transition-all duration-300 hover:-translate-y-2 text-center">
      {/* Icon */}
      <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
        <Icon size={28} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-3">{title}</h3>

      {/* Description */}
      <p className="text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}
