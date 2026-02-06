
"use client";

import React, { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { id: 1, name: "The Grand Atrium", address: "Milan, District 1", coords: { x: "30%", y: "40%" } },
  { id: 2, name: "Nordic Screen", address: "Stockholm, Södermalm", coords: { x: "60%", y: "30%" } },
  { id: 3, name: "Parisian Vault", address: "Paris, Le Marais", coords: { x: "45%", y: "65%" } },
];

export function CinemaMap() {
  const [selected, setSelected] = useState(LOCATIONS[0]);

  return (
    <div className="flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 w-full aspect-video relative glass rounded-3xl overflow-hidden mesh-gradient">
        {/* Abstract Map Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            className={cn(
              "absolute w-4 h-4 rounded-full transition-all duration-500",
              selected.id === loc.id ? "bg-white scale-150 shadow-[0_0_20px_white]" : "bg-white/20 hover:bg-white/40"
            )}
            style={{ left: loc.coords.x, top: loc.coords.y }}
            onClick={() => setSelected(loc)}
          >
            <div className={cn(
              "absolute inset-0 animate-ping bg-white rounded-full opacity-0",
              selected.id === loc.id && "opacity-20"
            )} />
          </button>
        ))}

        <div className="absolute bottom-8 left-8 glass rounded-2xl p-4 md:w-64 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-bold">Location</span>
          </div>
          <h4 className="font-serif text-xl font-bold">{selected.name}</h4>
          <p className="text-white/40 text-sm mb-4">{selected.address}</p>
          <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">
            Get Directions <Navigation className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="w-full md:w-80 flex flex-col gap-4">
        <h3 className="text-3xl font-serif font-bold mb-4 uppercase tracking-tighter">Our Houses</h3>
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelected(loc)}
            className={cn(
              "text-left p-6 rounded-2xl transition-all border outline-none",
              selected.id === loc.id 
                ? "bg-white/10 border-white/20 translate-x-2" 
                : "bg-transparent border-transparent text-white/40 hover:text-white"
            )}
          >
            <h5 className="font-bold uppercase tracking-tight">{loc.name}</h5>
            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60 font-bold">{loc.address}</p>
          </button>
        ))}
      </div>

    </div>
  );
}
