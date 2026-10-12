import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Lock, ExternalLink, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#15385F] text-white border-t border-[#0E2540] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: CCHIA Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-md bg-white text-[#15385F] flex items-center justify-center font-black text-sm">
                CC<span className="text-[#1C92A0]">IA</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Cámara Chilena de Inteligencia Artificial A.G.
              </span>
            </div>
            <p className="text-sm text-white/80 max-w-md leading-relaxed">
              Asociación gremial que articula, impulsa y representa al ecosistema de
              inteligencia artificial en Chile: empresas tecnológicas, instituciones académicas
              y profesionales especialistas.
            </p>
            <div className="p-3.5 rounded-md bg-[#0E2540]/80 border border-white/10 text-xs text-white/70 max-w-lg">
              <p className="font-semibold text-white/90 mb-1">Aviso legal del Directorio:</p>
              Información declarada por el socio y publicada con su autorización.
              Su inclusión no constituye certificación ni recomendación de la CCHIA.
            </div>
          </div>

          {/* Columna 2: Directorio & Categorías */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C92A0]">
              Directorio 2026
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/directorio" className="hover:text-white transition">
                  Todas las tarjetas
                </Link>
              </li>
              <li>
                <Link to="/directorio/categoria/ia-generativa" className="hover:text-white transition">
                  IA Generativa
                </Link>
              </li>
              <li>
                <Link to="/directorio/categoria/analitica-y-datos" className="hover:text-white transition">
                  Analítica y Datos
                </Link>
              </li>
              <li>
                <Link to="/directorio/categoria/gobernanza-y-etica" className="hover:text-white transition">
                  Gobernanza y Ética
                </Link>
              </li>
              <li>
                <Link to="/directorio/categoria/formacion" className="hover:text-white transition">
                  Formación y Academia
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal & Arquitectura */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C92A0]">
              Marco Normativo & Setup
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/privacidad" className="hover:text-white flex items-center transition">
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
                  Ley N.° 21.719
                </Link>
              </li>
              <li>
                <Link to="/confidencialidad" className="hover:text-white flex items-center transition">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
                  Confidencialidad CCHIA
                </Link>
              </li>
              <li>
                <Link to="/configuracion-firebase" className="hover:text-white flex items-center transition">
                  <Code2 className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
                  Configurar Firebase
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center transition text-xs text-white/60"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-white/40" />
                  sitemap.xml (SEO)
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center transition text-xs text-white/60"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-white/40" />
                  robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-white/60">
          <p>© 2026 Cámara Chilena de Inteligencia Artificial A.G. (CCHIA). Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0">Santiago, Chile • cchia.cl</p>
        </div>
      </div>
    </footer>
  );
};
