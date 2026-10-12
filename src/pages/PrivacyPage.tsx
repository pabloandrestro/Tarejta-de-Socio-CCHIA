import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/seo';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  useSEO({
    title: 'Política de Privacidad y Ley N.° 21.719 | CCHIA',
    description: 'Política oficial de protección de datos personales de la Cámara Chilena de Inteligencia Artificial A.G. conforme a la Ley N.° 21.719.',
  });

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        to="/directorio"
        className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#157A86] hover:text-[#15385F] transition mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Volver al Directorio
      </Link>

      <article className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 shadow-xs prose prose-slate max-w-none">
        <div className="flex items-center space-x-3 not-prose mb-6 pb-6 border-b border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-xl bg-[#EBF8FA] text-[#157A86] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#15385F] m-0">
              Política de Privacidad y Protección de Datos
            </h1>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Conforme a la Ley N.° 21.719 sobre Protección de Datos Personales de la República de Chile • Versión 1.0 (2026)
            </p>
          </div>
        </div>

        <section className="space-y-4 text-sm text-[#15385F]/90 leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2">
            1. Identificación del Responsable del Tratamiento
          </h2>
          <p>
            El responsable del tratamiento de los datos recabados a través de esta plataforma es la{' '}
            <strong>Cámara Chilena de Inteligencia Artificial A.G. (CCHIA)</strong>, asociación gremial
            constituida bajo las leyes de la República de Chile, con domicilio en Santiago, Chile.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            2. Marco Legal Aplicable: Ley N.° 21.719
          </h2>
          <p>
            El presente tratamiento de datos se rige estrictamente por los principios y disposiciones de la{' '}
            <strong>Ley N.° 21.719</strong> que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales, garantizando los derechos de los titulares.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            3. Finalidad del Tratamiento y Licitud
          </h2>
          <p>
            Los datos personales y de contacto recopilados en el formulario de la tarjeta de socio son tratados con las siguientes finalidades exclusivas:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Identificar a los socios activos de la CCHIA (empresas, instituciones y profesionales).</li>
            <li>Publicar la tarjeta oficial en el directorio público de la Cámara conforme al consentimiento expreso del socio.</li>
            <li>Facilitar el contacto directo entre clientes, organismos públicos y miembros del ecosistema de inteligencia artificial en Chile.</li>
            <li>Optimizar el posicionamiento digital y SEO de las organizaciones miembros.</li>
          </ul>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            4. Consentimiento y Registro de Aceptación
          </h2>
          <p>
            Conforme a la Ley N.° 21.719, el consentimiento es libre, informado, específico e inequívoco. Al marcar la casilla obligatoria en la pantalla de ingreso con Google o LinkedIn, el sistema almacena con precisión de auditoría:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>La fecha y hora exacta (timestamp) de la aceptación.</li>
            <li>La versión específica de esta política consentida.</li>
            <li>El identificador del usuario autenticado.</li>
          </ul>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            5. Derechos del Titular (ARCO)
          </h2>
          <p>
            Todo socio titular de datos puede ejercer en cualquier momento sus derechos de:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Acceso:</strong> Conocer los datos almacenados sobre su persona o empresa.</li>
            <li><strong>Rectificación:</strong> Actualizar o corregir su tarjeta en cualquier momento desde <code>/mi-tarjeta</code>.</li>
            <li><strong>Cancelación / Supresión:</strong> Solicitar la eliminación de su tarjeta del directorio público.</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento público de ciertos datos (como teléfono).</li>
          </ul>
          <p className="mt-2">
            Para ejercer estos derechos ante la CCHIA, puedes comunicarte formalmente a{' '}
            <a href="mailto:privacidad@cchia.cl" className="text-[#1C92A0] font-semibold underline">
              privacidad@cchia.cl
            </a>.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            6. Medidas de Seguridad
          </h2>
          <p>
            La CCHIA implementa medidas técnicas y organizativas para prevenir el acceso no autorizado, la pérdida o la alteración indebida de la información, garantizando que solo el propio socio y los administradores autorizados puedan modificar la información de su tarjeta.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center not-prose">
          <Link
            to="/ingresar"
            className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-xs bg-[#15385F] text-white hover:bg-[#0E2540] transition"
          >
            Ir al Ingreso de Socios
          </Link>
        </div>
      </article>
    </div>
  );
};
