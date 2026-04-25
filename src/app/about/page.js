import React from 'react';
import Image from 'next/image';
import gambar2 from '@/assets/gambar2.jpg';
import gambar3 from '@/assets/gambar3.jpg';
import gambar1 from '@/assets/gambar1.jpg';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-secondary/30">
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        
        {/* Who We Are */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-sm font-bold tracking-widest uppercase text-hover mb-8 flex items-center">
              <span className="w-8 h-[2px] bg-hover mr-4"></span>
              Who We Are
            </h2>
            <p className="text-3xl md:text-4xl font-bold leading-tight text-primary">
              We are a small team of developers who believe that simplicity is often overlooked in modern software.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <Image 
              src={gambar2} 
              alt="Team Illustration" 
              className="rounded-[2rem] shadow-2xl shadow-primary/10 rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </section>

        <hr className="border-slate-100 my-20" />

        {/* Our Perspective */}
        <section className="mb-24">
          <h2 className="text-sm font-bold tracking-widest uppercase text-hover mb-8 flex items-center">
            <span className="w-8 h-[2px] bg-hover mr-4"></span>
            Our Perspective
          </h2>
          <div className="space-y-8 text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
            <p>
              Many tools try to solve problems by adding more features. 
              <span className="text-primary font-bold"> We took a different approach.</span>
            </p>
            <p>
              Instead of giving users more control, we focused on reducing the need for control altogether.
            </p>
          </div>
        </section>

        <hr className="border-slate-100 my-20" />

        {/* Why Tarchiver Lite Exists */}
        <section className="mb-24 bg-slate-50 p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32"></div>
          <div className="md:w-3/5 relative z-10">
            <h2 className="text-sm font-bold tracking-widest uppercase text-hover mb-8 flex items-center">
              <span className="w-8 h-[2px] bg-hover mr-4"></span>
              Why Tarchiver Lite Exists
            </h2>
            <div className="space-y-8 text-xl text-slate-600 font-light leading-relaxed">
              <p>
                File management is often treated as a manual task something users have to maintain constantly.
              </p>
              <p className="text-primary font-bold italic border-l-4 border-secondary pl-6 py-2">
                "We see it differently."
              </p>
              <p>
                Tarchiver Lite was built on the idea that systems should enforce structure automatically, 
                so users don’t have to think about it.
              </p>
            </div>
          </div>
          <div className="md:w-2/5 relative z-10">
            <Image 
              src={gambar3} 
              alt="Team Working" 
              className="rounded-3xl shadow-xl border-4 border-white grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </section>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-20 mt-32">
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase text-hover mb-8 flex items-center">
              <span className="w-8 h-[2px] bg-hover mr-4"></span>
              Vision
            </h2>
            <div className="relative mb-8 h-48 rounded-2xl overflow-hidden group">
               <Image 
                src={gambar1} 
                alt="Vision" 
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/20"></div>
            </div>
            <p className="text-2xl font-medium text-primary leading-snug">
              A future where file organization is no longer a task, but a built-in system behavior.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase text-hover mb-8 flex items-center">
              <span className="w-8 h-[2px] bg-hover mr-4"></span>
              Mission
            </h2>
            <ul className="space-y-6">
              {[
                "Replace manual organization with automatic structure",
                "Keep systems simple, predictable, and efficient",
                "Build with intention, not excess"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-lg text-slate-700">
                  <span className="w-6 h-6 bg-secondary text-primary rounded-full flex-shrink-0 flex items-center justify-center mr-4 mt-1 font-bold text-xs">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

      </main>
    </div>
  );
}

