
"use client";

import React from "react";

export function BackgroundEffect() {
  return (
    <>
      {/* Film Grain Texture */}
      <div className="film-grain" />
      
      {/* Fluid Aura Gradients */}
      <div className="bg-aura" />
      
      {/* Dynamic Cursor Aura (Optional but premium) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div 
          className="absolute w-[800px] h-[800px] bg-white/10 rounded-full blur-[150px] mix-blend-soft-light"
          style={{
            top: '20%',
            left: '-10%',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] mix-blend-soft-light"
          style={{
            bottom: '10%',
            right: '-5%',
          }}
        />
      </div>
    </>
  );
}
