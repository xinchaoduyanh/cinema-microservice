
import React from "react";
import { Ticket, Sparkles, Gift, Zap } from "lucide-react";

export function BentoPromotions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[500px]">
      <div className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative">
        <div className="z-10">
          <Ticket className="w-10 h-10 mb-6 text-white" />
          <h3 className="text-3xl font-serif font-bold mb-4">Unlimited Membership</h3>
          <p className="text-white/60 max-w-xs">Experience the ultimate cinematic journey. One price, endless stories.</p>
        </div>
        <button className="z-10 self-start px-6 py-3 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform">
          Join Now
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors" />
      </div>

      <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center text-center group">
        <Sparkles className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
        <h4 className="font-bold uppercase tracking-widest text-xs">VIF Rewards</h4>
        <p className="text-xl font-serif mt-2">Earn 2x Points</p>
      </div>

      <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center text-center group">
        <Gift className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform text-red-500" />
        <h4 className="font-bold uppercase tracking-widest text-xs">Birthday gift</h4>
        <p className="text-xl font-serif mt-2">Free Popcorn</p>
      </div>

      <div className="md:col-span-2 glass rounded-3xl p-8 flex items-center justify-between group overflow-hidden relative">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-2">Student Night</h3>
          <p className="text-white/60 text-sm">Every Tuesday. Save up to 50%.</p>
        </div>
        <Zap className="w-12 h-12 text-yellow-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </div>
  );
}
