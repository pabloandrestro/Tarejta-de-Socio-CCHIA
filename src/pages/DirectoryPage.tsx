import React, { useState, useMemo } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { SummaryCard } from '../components/SummaryCard';
import { CATEGORIES, MEMBER_TYPES, Category, MemberType } from '../types';
import { useSEO } from '../utils/seo';
import { Search, Filter, X, Sparkles, Building2, Users } from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { publishedCards } = useDirectory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  useSEO({
    title: 'Directorio de Empresas y Profesionales Socios CCHIA 2026',
    description: 'Conoce a quienes forman la Cámara Chilena de Inteligencia Artificial A.G. (CCHIA). Empresas, instituciones y profesionales del ecosistema de IA en Chile.',
  });

  const filteredCards = useMemo(() => {
    return publishedCards.filter(card => {
      // Filtro de texto: nombre, título o descripción
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = card.nombre.toLowerCase().includes(query);
        const matchesTitle = card.titulo.toLowerCase().includes(query);
        const matchesDesc = card.descripcion.toLowerCase().includes(query);
        if (!matchesName && !matchesTitle && !matchesDesc) return false;
      }

      // Filtro tipo
      if (selectedType !== 'todos' && card.tipo !== selectedType) {
        return false;
      }

      // Filtro categoría
      if (selectedCategory !== 'todas' && card.categoria !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [publishedCards, searchQuery, selectedType, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('todos');
    setSelectedCategory('todas');
  };

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'todos' || selectedCategory !== 'todas';

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Encabezado oficial CCHIA (Requirement 7) */}
      <section className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#15385F] text-white flex items-center justify-center font-heading font-black text-2xl border-2 border-[#1C92A0]">
            CC<span className="text-[#1C92A0]">IA</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#15385F] tracking-tight leading-tight">
          Directorio de Empresas y Profesionales Socios CCHIA 2026
        </h1>
        <p className="mt-4 text-base sm:text-xl text-[#157A86] font-medium leading-relaxed">
          Conoce a quienes forman la Cámara Chilena de Inteligencia Artificial
        </p>
        <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
          Ecosistema gremial activo compuesto por 132 socios en todo el territorio nacional
        </p>
      </section>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Buscador */}
          <div className="md:col-span-6 relative">
            <label htmlFor="search-input" className="sr-only">
              Buscar socios por nombre, título o servicio
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, título del servicio o palabras clave..."
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#15385F] placeholder-[#94A3B8] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div className="md:col-span-3">
            <label htmlFor="tipo-filter" className="sr-only">
              Filtrar por tipo de socio
            </label>
            <select
              id="tipo-filter"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
            >
              <option value="todos">Todos los tipos de socio</option>
              {MEMBER_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div className="md:col-span-3">
            <label htmlFor="categoria-filter" className="sr-only">
              Filtrar por categoría
            </label>
            <select
              id="categoria-filter"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
            >
              <option value="todas">Todas las categorías</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de estado de filtros activos */}
        <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#1C92A0]" />
            <span>
              Mostrando <strong className="text-[#15385F]">{filteredCards.length}</strong> de{' '}
              <strong className="text-[#15385F]">{publishedCards.length}</strong> tarjetas publicadas
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center text-xs font-semibold text-[#157A86] hover:text-[#15385F] underline"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Grilla de Tarjetas Resumidas */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map(card => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0] p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#EBF8FA] text-[#157A86] flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-bold text-[#15385F]">
            No se encontraron socios
          </h3>
          <p className="mt-2 text-sm text-[#64748B]">
            No hay tarjetas que coincidan con los criterios de búsqueda seleccionados.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-[#1C92A0] text-white hover:bg-[#157A86] transition shadow-xs"
          >
            Ver todos los socios
          </button>
        </div>
      )}
    </div>
  );
};
