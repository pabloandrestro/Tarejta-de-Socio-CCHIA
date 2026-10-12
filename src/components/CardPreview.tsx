import React, { useState } from 'react';
import { Card } from '../types';
import {
  Globe,
  Mail,
  Phone,
  Share2,
  Check,
  ExternalLink,
  User,
  Building,
  GraduationCap,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface CardPreviewProps {
  card: Partial<Card>;
  isFullPage?: boolean;
  onShare?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, isFullPage = false }) => {
  const [copied, setCopied] = useState(false);

  const nombre = card.nombre?.trim() || 'Nombre del Socio';
  const titulo = card.titulo?.trim() || 'Título descriptivo del servicio de Inteligencia Artificial';
  const tipo = card.tipo || 'Empresa';
  const categoria = card.categoria || 'IA generativa';
  const descripcion = card.descripcion?.trim() || 'Descripción detallada de las capacidades y soluciones tecnológicas que ofrece este socio dentro del ecosistema nacional.';
  const contactoNombre = card.contactoNombre?.trim() || 'Nombre del Contacto';
  const email = card.email?.trim() || 'contacto@socio-cchia.cl';
  const telefono = card.telefono?.trim();
  const mostrarTelefono = Boolean(card.mostrarTelefono && telefono);
  const web = card.web?.trim();
  const linkedin = card.linkedin?.trim();
  const instagram = card.instagram?.trim();
  const otroEnlace = card.otroEnlace?.trim();
  const initial = nombre.charAt(0).toUpperCase() || 'S';

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const getTipoIcon = () => {
    switch (tipo) {
      case 'Empresa':
        return <Building className="w-3.5 h-3.5 mr-1 text-[#15385F]" />;
      case 'Institución':
        return <GraduationCap className="w-3.5 h-3.5 mr-1 text-[#15385F]" />;
      case 'Profesional':
        return <User className="w-3.5 h-3.5 mr-1 text-[#15385F]" />;
    }
  };

  return (
    <article
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all duration-200 ${
        isFullPage ? 'max-w-3xl mx-auto shadow-md' : 'w-full'
      }`}
    >
      {/* Top Banner Stripe with CCHIA Color Tone */}
      <div className="h-3 bg-gradient-to-r from-[#15385F] via-[#1C92A0] to-[#157A86]" />

      <div className="p-6 sm:p-8">
        {/* Header row: Logo + Status badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Logo or Initial circle */}
            {card.logoUrl ? (
              <img
                src={card.logoUrl}
                alt={`Logo de ${nombre}`}
                className="w-20 h-20 rounded-xl object-contain border border-[#E2E8F0] p-1 bg-white shadow-xs"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-xl bg-[#15385F] text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-xs border-2 border-[#1C92A0]/30"
                aria-label={`Logo de ${nombre}`}
              >
                {initial}
              </div>
            )}

            <div>
              {/* Type and Category chips */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#15385F] border border-[#CBD5E1]">
                  {getTipoIcon()}
                  {tipo}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF8FA] text-[#157A86] border border-[#BDE7EC]">
                  {categoria}
                </span>
                {card.esEjemplo && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    Ejemplo
                  </span>
                )}
                {card.estado && card.estado !== 'Publicada' && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      card.estado === 'En revisión'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : card.estado === 'Borrador'
                        ? 'bg-gray-100 text-gray-700 border border-gray-300'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {card.estado}
                  </span>
                )}
              </div>

              {/* Member Name */}
              {isFullPage ? (
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#15385F] tracking-tight">
                  {nombre}
                </h1>
              ) : (
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#15385F] tracking-tight">
                  {nombre}
                </h3>
              )}
            </div>
          </div>

          {/* Share Button (Public detail page) */}
          {isFullPage && (
            <button
              onClick={handleShare}
              className="inline-flex items-center self-start px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#CBD5E1] bg-white text-[#15385F] hover:bg-[#F7F9FB] hover:border-[#1C92A0] transition shadow-xs focus:ring-2 focus:ring-[#1C92A0]"
              title="Copiar enlace de esta tarjeta"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                  <span className="text-emerald-700">Enlace copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-1.5 text-[#1C92A0]" />
                  Compartir
                </>
              )}
            </button>
          )}
        </div>

        {/* Service Title */}
        <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
          <p className="text-base sm:text-lg font-semibold text-[#157A86] leading-snug">
            {titulo}
          </p>
        </div>

        {/* Description */}
        <div className="mt-3">
          <p className="text-sm sm:text-base text-[#15385F]/90 leading-relaxed whitespace-pre-line">
            {descripcion}
          </p>
        </div>

        {/* Contact info bar */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#15385F]/80">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-[#1C92A0] shrink-0" />
            <span>
              <strong className="text-[#15385F] font-semibold">Contacto:</strong> {contactoNombre}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#1C92A0] shrink-0" />
            <a
              href={`mailto:${email}`}
              className="hover:text-[#1C92A0] underline underline-offset-2 truncate"
            >
              {email}
            </a>
          </div>

          {mostrarTelefono && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#1C92A0] shrink-0" />
              <a
                href={`tel:${telefono}`}
                className="hover:text-[#1C92A0] underline underline-offset-2"
              >
                {telefono}
              </a>
            </div>
          )}
        </div>

        {/* Action / Social links row */}
        <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex flex-wrap gap-2.5 items-center">
          {/* Web link - WITHOUT nofollow per Requirement 8 */}
          {web && (
            <a
              href={web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              Sitio Web
            </a>
          )}

          {/* LinkedIn */}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] transition shadow-xs"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              LinkedIn
            </a>
          )}

          {/* Instagram */}
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#E1306C] text-white hover:bg-[#C13584] transition shadow-xs"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              Instagram
            </a>
          )}

          {/* Email button */}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#F1F5F9] text-[#15385F] hover:bg-[#E2E8F0] transition border border-[#CBD5E1]"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
              Enviar Correo
            </a>
          )}

          {/* Otro enlace */}
          {otroEnlace && (
            <a
              href={otroEnlace}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-[#157A86] hover:bg-[#EBF8FA] transition border border-[#1C92A0]/30"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Portafolio / Enlace
            </a>
          )}
        </div>
      </div>

      {/* Pie Fijo Obligatorio (Requirement 7) */}
      <div className="bg-[#F7F9FB] px-6 py-3.5 border-t border-[#E2E8F0] text-center">
        <p className="text-[11px] sm:text-xs text-[#64748B] leading-tight">
          Información declarada por el socio y publicada con su autorización. Su inclusión no constituye certificación ni recomendación de la CCHIA.
        </p>
      </div>
    </article>
  );
};
