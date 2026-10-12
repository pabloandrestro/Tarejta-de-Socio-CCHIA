import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDirectory } from '../context/DirectoryContext';
import { SummaryCard } from '../components/SummaryCard';
import { CATEGORIES } from '../types';
import { slugToCategory } from '../utils/slug';
import { useSEO } from '../utils/seo';
import { ArrowLeft, Tag, Layers } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { publishedCards } = useDirectory();

  const categoryName = slug ? slugToCategory(slug, CATEGORIES) : undefined;

  const cardsInCategory = categoryName
    ? publishedCards.filter(c => c.categoria === categoryName)
    : [];

  const title = categoryName
    ? `Socios CCHIA en ${categoryName} | Directorio 2026`
    : 'Categoría de Socios | Directorio CCHIA';

  const description = categoryName
    ? `Explora las empresas, instituciones y profesionales especializados en ${categoryName} miembros de la Cámara Chilena de Inteligencia Artificial.`
    : 'Categorías de socios de la CCHIA.';

  useSEO({
    title,
    description,
    canonicalUrl: slug ? `${window.location.origin}/directorio/categoria/${slug}` : undefined,
  });

  if (!categoryName) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-heading font-bold text-[#15385F]">
          Categoría no encontrada
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          No pudimos identificar la categoría solicitada.
        </p>
        <Link
          to="/directorio"
          className="mt-6 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#15385F] text-white hover:bg-[#0E2540]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Directorio
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          to="/directorio"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#157A86] hover:text-[#15385F] transition mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Volver a todos los socios
        </Link>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF8FA] text-[#157A86] border border-[#BDE7EC] mb-3">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            Categoría Oficial CCHIA
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#15385F] tracking-tight">
            Socios especializados en {categoryName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {cardsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsInCategory.map(card => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0] p-8 max-w-md mx-auto">
          <Layers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-[#15385F]">
            Aún no hay tarjetas en esta categoría
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
            Los socios que ofrecen soluciones en {categoryName} aparecerán aquí una vez aprobadas sus tarjetas.
          </p>
          <Link
            to="/directorio"
            className="mt-4 inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#15385F] text-white hover:bg-[#0E2540]"
          >
            Ver todos los socios
          </Link>
        </div>
      )}
    </div>
  );
};
