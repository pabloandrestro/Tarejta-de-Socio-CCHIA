import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

function geminiDevPlugin(): Plugin {
  return {
    name: 'gemini-dev-endpoint',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/mejorar-redaccion' || req.url === '/api/improve-copy') {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }

          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { titulo = '', descripcion = '', tipo = 'Empresa', categoria = 'IA', nombre = 'Socio CCHIA' } = body;

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  titulo: (titulo || 'Servicios especializados de IA').slice(0, 80),
                  descripcion: (descripcion || `Soluciones avanzadas en ${categoria} para empresas en Chile.`).slice(0, 300),
                  explicacion: 'Redacción ajustada a los límites de caracteres permitidos para el directorio CCHIA.'
                }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: { 'User-Agent': 'aistudio-build' }
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
1. "titulo": NO PUEDE exceder 80 caracteres (incluyendo espacios).
2. "descripcion": NO PUEDE exceder 300 caracteres (incluyendo espacios).
3. "explicacion": Breve explicación (1 o 2 oraciones en español).

Devuelve únicamente un objeto JSON con las claves exactas: "titulo", "descripcion", "explicacion".`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      titulo: { type: Type.STRING },
                      descripcion: { type: Type.STRING },
                      explicacion: { type: Type.STRING },
                    },
                    required: ['titulo', 'descripcion', 'explicacion'],
                  },
                },
              });

              const parsed = JSON.parse(response.text || '{}');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                titulo: (parsed.titulo || titulo).slice(0, 80),
                descripcion: (parsed.descripcion || descripcion).slice(0, 300),
                explicacion: parsed.explicacion || 'Redacción optimizada para el directorio CCHIA.'
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Error en asistente Gemini' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
