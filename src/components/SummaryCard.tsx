import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../types';
import { ArrowRight, Building, GraduationCap, User } from 'lucide-react';

interface SummaryCardProps {
  card: Card;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ card }) => {
  const initial = card.nombre.charAt(0).toUpperCase() || 'S';

  const getTipoIcon = () => {
    switch (card.tipo) {
      case 'Empresa':
        return <Building className="w-3 h-3 mr-1 text-[#15385F]" />;
      case 'Institución':
        return <GraduationCap className="w-3 h-3 mr-1 text-[#15385F]" />;
      case 'Profesional':
        return <User className="w-3 h-3 mr-1 text-[#15385F]" />;
    }
  };

  return (
    <Link
      to={`/directorio/${card.slug}`}
      className="group bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:shadow-md hover:border-[#1C92A0]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        {/* Top: Logo & Chips */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {card.logoUrl ? (
            <img
              src={card.logoUrl}
              alt={`Logo de ${card.nombre}`}
              className="w-14 h-14 rounded-lg object-contain border border-[#E2E8F0] p-1 bg-white shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-lg bg-[#15385F] text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 group-hover:scale-105 transition-transform"
              aria-label={`Logo de ${card.nombre}`}
            >
              {initial}
            </div>
          )}

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#15385F] border border-[#CBD5E1]">
              {getTipoIcon()}
              {card.tipo}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF8FA] text-[#157A86] border border-[#BDE7EC]">
              {card.categoria}
            </span>
          </div>
        </div>

        {/* Member Name */}
        <h3 className="font-heading font-bold text-lg text-[#15385F] group-hover:text-[#1C92A0] transition-colors line-clamp-1">
          {card.nombre}
        </h3>

        {/* Service Title */}
        <p className="mt-1 text-sm font-semibold text-[#157A86] line-clamp-2 leading-snug">
          {card.titulo}
        </p>

        {/* Short description preview */}
        <p className="mt-2.5 text-xs text-[#15385F]/75 line-clamp-2 leading-relaxed">
          {card.descripcion}
        </p>
      </div>

      {/* Footer bar of summary card */}
      <div className="px-5 py-3 bg-[#F7F9FB] border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#157A86] group-hover:text-[#1C92A0]">
        <span>Ver tarjeta completa</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
