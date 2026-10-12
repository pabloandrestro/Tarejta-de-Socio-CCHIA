import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDirectory } from '../context/DirectoryContext';
import { CardPreview } from '../components/CardPreview';
import { useSEO } from '../utils/seo';
import { ArrowLeft, AlertCircle, Building2, ShieldAlert } from 'lucide-react';

export const CardDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCardBySlug, currentUser } = useDirectory();

  const card = slug ? getCardBySlug(slug) : undefined;

  // SEO setup according to requirement 8
  const seoTitle = card
    ? `${card.titulo} — ${card.nombre} | Directorio CCHIA`
    : 'Tarjeta no encontrada | Directorio CCHIA';

  const seoDescription = card
    ? card.descripcion
    : 'Tarjeta de socio de la Cámara Chilena de Inteligencia Artificial.';

  useSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalUrl: card ? `${window.location.origin}/directorio/${card.slug}` : undefined,
    imageUrl: card?.logoUrl,
    type: card?.tipo === 'Profesional' ? 'profile' : 'website',
    card: card,
  });

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-[#15385F]">
          Tarjeta de socio no encontrada
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          No encontramos ninguna tarjeta activa con el identificador «{slug}». Es posible que haya sido modificada o removida.
        </p>
        <div className="mt-6">
          <Link
            to="/directorio"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Directorio
          </Link>
        </div>
      </div>
    );
  }

  // Comprobar si la tarjeta está oculta o en borrador y no es admin o dueño
  const isOwner = currentUser?.uid === card.ownerUid;
  const isAdmin = currentUser?.rol === 'admin';
  const canView = card.estado === 'Publicada' || isOwner || isAdmin;

  if (!canView) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-[#15385F]">
          Tarjeta en estado no público
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Esta tarjeta se encuentra actualmente en estado «{card.estado}» y solo puede ser visualizada por su propietario o por la administración de la CCHIA.
        </p>
        <div className="mt-6">
          <Link
            to="/directorio"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Directorio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Botón de retorno al directorio */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/directorio"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#157A86] hover:text-[#15385F] transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Volver a todos los socios
        </Link>

        {isOwner && (
          <Link
            to="/mi-tarjeta"
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-md bg-[#EBF8FA] text-[#157A86] hover:bg-[#1C92A0] hover:text-white transition"
          >
            Editar mi tarjeta
          </Link>
        )}
      </div>

      {/* Renderizado de Tarjeta Pública con todos los requisitos */}
      <CardPreview card={card} isFullPage={true} />
    </div>
  );
};
