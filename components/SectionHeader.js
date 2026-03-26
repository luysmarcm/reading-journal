import React from 'react';

const SectionHeader = ({ title, emoji }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <h2 className="text-xl font-serif text-stone-800 tracking-tight">
        {title}
      </h2>
      {emoji && (
        <span className="text-lg opacity-80 select-none">
          {emoji}
        </span>
      )}
      {/* Línea decorativa sutil (estilo scrapbook) */}
      <div className="flex-1 h-[1px] bg-stone-100 ml-4 opacity-50" />
    </div>
  );
};

export default SectionHeader;