import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const GenreCard = ({ genre, navigate }) => {
  return (
    <Card 
      onClick={() => {
        sessionStorage.setItem("filters", JSON.stringify({ category: [genre.id] }));
        navigate("/shop/listing");
      }}
      className={`group relative h-80 overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-xl cursor-pointer transition-all duration-500 hover:border-white/20`}
    >
      <CardContent className="p-0 h-full flex flex-col justify-end">
        
        {/* IMAGE LAYER: Space for your custom images */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={`/genres/${genre.id}.jpg`} 
            alt={genre.label}
            className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 ease-out"
          />
          {/* Editorial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 p-8">
          <div className={`w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-slate-900`}>
            <genre.icon className={`w-7 h-7 ${genre.color} transition-transform group-hover:scale-110`} />
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{genre.label}</h3>
            </div>
            <div className="p-2 rounded-full bg-white text-black opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </CardContent>
    </Card>
  );
};

export default GenreCard;