import React from 'react';

const StatCard = ({ icon: Icon, label, value, color = "stone" }) => {
  // Mapeo de colores sutiles para los iconos
  const colorMap = {
    stone: "text-stone-300",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    pink: "text-pink-300"
  };

  return (
    <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-transform hover:scale-[1.02]">
      {/* Icono dinámico de Lucide */}
      {Icon && <Icon className={`${colorMap[color] || "text-stone-300"} mb-3`} size={22} />}
      
      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.1em] mb-1">
        {label}
      </p>
      
      <h3 className="text-2xl font-serif text-stone-800 leading-none">
        {value}
      </h3>
    </div>
  );
};

export default StatCard;