import React from "react";
import { Contact } from "./types";

interface ContactCardProps extends Contact {
}

export const ContactCard: React.FC<ContactCardProps> = ({ 
  title, 
  description, 
}) => {
  return (
    <div 
      className="flex p-4 mb-4 h-full flex-col overflow-hidden border border-stone-200 bg-white  transition-all duration-500 hover:-translate-y-1 hover:border-stone-300 hover:shadow-xl sm:p-8"
    >
      {/* Animated Accent: 
          Uses scale-x for better performance and 'origin-left' 
          to grow from the left side. 
      */}
      <div 
        className="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 bg-emerald-800 transition-transform duration-500 ease-out group-hover:scale-x-100" 
        aria-hidden="true"
      />

      {/* Header: Tightened tracking for a premium serif look */}
      <h3 className="mb-4 font-serif text-2xl font-black tracking-tight text-stone-900 md:text-3xl">
        {title}
      </h3>
      
      {/* Body: 'max-w-prose' prevents lines from becoming too long to read */}
      <p className="max-w-prose text-sm leading-relaxed text-stone-500 line-clamp-4">
        {description}
      </p>

      {/* Footer: 'mt-auto' creates a flexible spacer that pushes 
          the action link to the bottom.
      */}
      <div className="mt-auto pt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 transition-colors duration-300 group-hover:text-emerald-800">
        <span>Voir la fiche</span>
        <span className="transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  );
};