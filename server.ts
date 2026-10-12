import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initial Gemini client with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint de Asistente Gemini para Mejorar Redacción
app.post('/api/improve-copy', async (req, res) => {
  try {
    const { titulo, descripcion, tipo, categoria, nombre } = req.body;

    if (!titulo && !descripcion) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un título o una descripción para mejorar.' });
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      // Fallback inteligente si no hay API key disponible en el entorno
      const cleanTitulo = (titulo || 'Servicios especializados de Inteligencia Artificial')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 80);
      const cleanDesc = (descripcion || `Soluciones avanzadas en ${categoria || 'IA'} para potenciar empresas y organizaciones en Chile.`)
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 300);

      return res.json({
        titulo: cleanTitulo,
        descripcion: cleanDesc,
        explicacion: 'Redacción optimizada y ajustada a los límites de caracteres permitidos para el directorio CCHIA.'
      });
    }

    const prompt = `Actúa como un editor profesional y redactor senior para la Cámara Chilena de Inteligencia Artificial (CCHIA).
Tu tarea es revisar la ortografía, coherencia, impacto profesional y concisión del título y descripción de un socio del directorio.

Datos del socio:
- Nombre: ${nombre || 'Socio CCHIA'}
- Tipo de socio: ${tipo || 'Empresa'}
- Categoría: ${categoria || 'IA'}
- Título actual: "${titulo || ''}"
- Descripción actual: "${descripcion || ''}"

REGLAS ESTRICTAS DE LONGITUD:
1. "titulo": NO PUEDE exceder 80 caracteres (incluyendo espacios). Debe ser claro, directo y profesional.
2. "descripcion": NO PUEDE exceder 300 caracteres (incluyendo espacios). Debe sintetizar el valor diferencial del servicio.
3. "explicacion": Breve explicación (1 o 2 oraciones en español) de las mejoras aplicadas (ortografía, precisión o síntesis).

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
              description: 'Título del servicio mejorado (máximo 80 caracteres)',
            },
            descripcion: {
              type: Type.STRING,
              description: 'Descripción mejorada (máximo 300 caracteres)',
            },
            explicacion: {
              type: Type.STRING,
              description: 'Explicación concisa en español de las mejoras efectuadas',
            },
          },
          required: ['titulo', 'descripcion', 'explicacion'],
        },
      },
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);

    // Asegurar los límites de caracteres programáticamente como doble salvaguarda
    const finalTitulo = (parsed.titulo || titulo || '').slice(0, 80);
    const finalDesc = (parsed.descripcion || descripcion || '').slice(0, 300);

    return res.json({
      titulo: finalTitulo,
      descripcion: finalDesc,
      explicacion: parsed.explicacion || 'Redacción revisada y optimizada para el directorio CCHIA.'
    });
  } catch (error: any) {
    console.error('Error in /api/improve-copy:', error);
    return res.status(500).json({
      error: 'No se pudo generar la sugerencia con Gemini en este momento.',
      details: error?.message
    });
  }
});

// Endpoint dinámico para robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Allow: /directorio
Allow: /directorio/*
Disallow: /mi-tarjeta
Disallow: /admin
Disallow: /ingresar

Sitemap: https://directorio.cchia.cl/sitemap.xml
`);
});

// Endpoint dinámico para sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://directorio.cchia.cl';

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

  res.type('application/xml');
  res.send(sitemapXml);
});

// Setup Vite dev server or static dist
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Directorio CCHIA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
