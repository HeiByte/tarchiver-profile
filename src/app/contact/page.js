
import React from 'react';
import Image from 'next/image';
import gambar6 from '@/assets/gambar6.jpg';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-secondary/30">
      <main className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          <div>
            <header className="mb-12">
              <h2 className="text-sm font-bold tracking-widest uppercase text-hover mb-6 flex items-center">
                <span className="w-8 h-[2px] bg-hover mr-4"></span>
                Let’s Connect
              </h2>
              <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight mb-8">
                Have a question, feedback, or just curious?
              </h1>
            </header>

            <div className="relative mb-12 rounded-[2rem] overflow-hidden group h-64 shadow-2xl">
              <Image 
                src={gambar6} 
                alt="Our Office" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-bold uppercase tracking-widest">Our Workspace</p>
                <p className="text-lg opacity-80">Designed for collaboration and focus.</p>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Contact Details</h3>
                <div className="space-y-4">
                  <a href="mailto:tarchiverlite@example.com" className="block text-2xl font-medium text-primary hover:text-hover transition-colors">
                    tarchiverlite@example.com
                  </a>
                  <a href="tel:+62812XXXXXXX" className="block text-2xl font-medium text-primary hover:text-hover transition-colors">
                    +62 812-XXXX-XXXX
                  </a>
                </div>
              </div>

              <div className="pt-12 border-t border-slate-100">
                <p className="text-slate-500 italic">
                  We’ll get back to you as soon as possible.
                </p>
              </div>
            </div>
          </div>


          <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-primary font-black text-2xl rotate-12 shadow-lg">
              Hi!
            </div>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-primary ml-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-hover/20 focus:border-hover transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-primary ml-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-hover/20 focus:border-hover transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-primary ml-1">Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  placeholder="How can we help you?"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-hover/20 focus:border-hover transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-hover transition-all shadow-xl shadow-primary/20 transform active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
}