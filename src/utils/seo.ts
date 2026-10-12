import { useEffect } from 'react';
import { Card } from '../types';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  card?: Card;
}

export function updateSEO({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type = 'website',
  card
}: SEOProps) {
  // Update document title
  document.title = title;

  // Update or create standard meta description
  setMetaTag('name', 'description', description);

  // Open Graph
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', type);
  setMetaTag('property', 'og:url', canonicalUrl || window.location.href);
  if (imageUrl) {
    setMetaTag('property', 'og:image', imageUrl);
  }

  // Twitter Card
  setMetaTag('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  if (imageUrl) {
    setMetaTag('name', 'twitter:image', imageUrl);
  }

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl || window.location.href);

  // Schema.org JSON-LD structured data
  let scriptEl = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'schema-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  if (card) {
    const isPerson = card.tipo === 'Profesional';
    const sameAs: string[] = [];
    if (card.linkedin) sameAs.push(card.linkedin);
    if (card.instagram) sameAs.push(card.instagram);
    if (card.otroEnlace) sameAs.push(card.otroEnlace);

    const schemaData = isPerson
      ? {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: card.nombre,
          jobTitle: card.titulo,
          description: card.descripcion,
          image: card.logoUrl || undefined,
          url: card.web || canonicalUrl || window.location.href,
          email: card.email,
          telephone: card.mostrarTelefono ? card.telefono : undefined,
          sameAs: sameAs.length > 0 ? sameAs : undefined,
          memberOf: {
            '@type': 'Organization',
            name: 'Cámara Chilena de Inteligencia Artificial A.G.',
            url: 'https://cchia.cl'
          }
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: card.nombre,
          description: card.descripcion,
          logo: card.logoUrl || undefined,
          image: card.logoUrl || undefined,
          url: card.web || canonicalUrl || window.location.href,
          email: card.email,
          telephone: card.mostrarTelefono ? card.telefono : undefined,
          sameAs: sameAs.length > 0 ? sameAs : undefined,
          memberOf: {
            '@type': 'Organization',
            name: 'Cámara Chilena de Inteligencia Artificial A.G.',
            url: 'https://cchia.cl'
          }
        };

    scriptEl.textContent = JSON.stringify(schemaData);
  } else {
    // Default organization schema
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Cámara Chilena de Inteligencia Artificial A.G.',
      alternateName: 'CCHIA',
      url: 'https://cchia.cl',
      description: 'Asociación gremial que reúne a empresas, universidades y profesionales de inteligencia artificial en Chile.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CL'
      }
    };
    scriptEl.textContent = JSON.stringify(defaultSchema);
  }
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO(props: SEOProps) {
  useEffect(() => {
    updateSEO(props);
  }, [props.title, props.description, props.canonicalUrl, props.imageUrl, props.card]);
}
