import { GoogleGenAI, Type } from '@google/genai';

export interface Env {
  GEMINI_API_KEY?: string;
  APP_URL?: string;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

interface ImproveRequestBody {
  titulo?: string;
  descripcion?: string;
  tipo?: string;
  categoria?: string;
  nombre?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Endpoint: POST /api/mejorar-redaccion (y alias /api/improve-copy)
    if (url.pathname === '/api/mejorar-redaccion' || url.pathname === '/api/improve-copy') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido. Usa POST.' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return handleMejorarRedaccion(request, env);
    }

    // Endpoint: GET /robots.txt
    if (url.pathname === '/robots.txt') {
      const robotsTxt = `User-agent: *
Allow: /
Allow: /directorio
Allow: /directorio/*
Disallow: /mi-tarjeta
Disallow: /admin
Disallow: /ingresar

Sitemap: https://directorio.cchia.cl/sitemap.xml
`;
      return new Response(robotsTxt, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // Endpoint: GET /sitemap.xml
    if (url.pathname === '/sitemap.xml') {
      const baseUrl = env.APP_URL || url.origin;
      const categories = [
        'ia-generativa',
        'analitica-y-datos',
        'vision-computacional',
        'automatizacion',
        'gobernanza-y-etica',
        'formacion',
        'consultoria',
        'infraestructura-y-hardware',
        'otra'
      ];
      const sampleSlugs = [
        'lumen-data-spa',
        'instituto-profesional-cordillera',
        'daniela-soto-rios'
      ];

      const xmlUrls = [
        `<url><loc>${baseUrl}/directorio</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
        ...categories.map(c => `<url><loc>${baseUrl}/directorio/categoria/${c}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
        ...sampleSlugs.map(s => `<url><loc>${baseUrl}/directorio/${s}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`)
      ];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls.join('\n')}
</urlset>`;

      return new Response(sitemapXml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Servir recursos estáticos o SPA vía Cloudflare Assets
    return env.ASSETS.fetch(request);
  }
};

async function handleMejorarRedaccion(request: Request, env: Env): Promise<Response> {
  try {
    const body: ImproveRequestBody = await request.json();
    const { titulo = '', descripcion = '', tipo = 'Empresa', categoria = 'IA', nombre = 'Socio CCHIA' } = body;

    if (!titulo.trim() && !descripcion.trim()) {
      return new Response(
        JSON.stringify({ error: 'Debes proporcionar al menos un título o descripción para mejorar.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clave secreta configurada en Cloudflare Workers
    const apiKey = env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

    if (!apiKey) {
      // Fallback seguro si la variable secreta GEMINI_API_KEY aún no se ha configurado en Cloudflare
      const cleanTitulo = (titulo || 'Servicios especializados de Inteligencia Artificial')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 80);
      const cleanDesc = (descripcion || `Soluciones avanzadas en ${categoria} para potenciar empresas y organizaciones en Chile.`)
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 300);

      return new Response(
        JSON.stringify({
          titulo: cleanTitulo,
          descripcion: cleanDesc,
          explicacion: 'Redacción optimizada y ajustada a los límites de caracteres del directorio CCHIA.'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Inicialización del SDK oficial de Google Gen AI con User-Agent requerido
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Actúa como un editor profesional y redactor senior para la Cámara Chilena de Inteligencia Artificial (CCHIA).
Tu tarea es revisar la ortografía, coherencia, impacto profesional y concisión del título y descripción de un socio del directorio.

Datos del socio:
- Nombre: ${nombre}
- Tipo de socio: ${tipo}
- Categoría: ${categoria}
- Título actual: "${titulo}"
- Descripción actual: "${descripcion}"

REGLAS ESTRICTAS DE LONGITUD:
1. "titulo": NO PUEDE exceder 80 caracteres (incluyendo espacios). Claro, directo y profesional.
2. "descripcion": NO PUEDE exceder 300 caracteres (incluyendo espacios). Síntesis del valor diferencial.
3. "explicacion": Breve explicación (1 o 2 oraciones en español) de las mejoras aplicadas.

Devuelve únicamente un objeto JSON con las claves exactas: "titulo", "descripcion", "explicacion".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titulo: {
              type: Type.STRING,
              description: 'Título del servicio mejorado (máximo 80 caracteres)'
            },
            descripcion: {
              type: Type.STRING,
              description: 'Descripción mejorada (máximo 300 caracteres)'
            },
            explicacion: {
              type: Type.STRING,
              description: 'Explicación concisa en español de las mejoras efectuadas'
            }
          },
          required: ['titulo', 'descripcion', 'explicacion']
        }
      }
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);

    // Garantizar límites estrictos
    const finalTitulo = (parsed.titulo || titulo || '').slice(0, 80);
    const finalDesc = (parsed.descripcion || descripcion || '').slice(0, 300);

    return new Response(
      JSON.stringify({
        titulo: finalTitulo,
        descripcion: finalDesc,
        explicacion: parsed.explicacion || 'Redacción optimizada para el directorio CCHIA.'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    console.error('[Worker] Error al llamar a Gemini:', error);
    return new Response(
      JSON.stringify({
        error: 'No se pudo generar la sugerencia con Gemini.',
        details: error?.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
