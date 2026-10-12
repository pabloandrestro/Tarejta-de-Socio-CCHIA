import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../utils/seo';
import { Lock, ArrowLeft, Shield, Users } from 'lucide-react';

export const ConfidentialityPage: React.FC = () => {
  useSEO({
    title: 'Acuerdo de Confidencialidad CCHIA | Directorio 2026',
    description: 'Acuerdo de confidencialidad y lealtad gremial de la comunidad de la Cámara Chilena de Inteligencia Artificial A.G.',
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
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#15385F] m-0">
              Acuerdo de Confidencialidad de la Comunidad CCHIA
            </h1>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Normas de confianza gremial y buen uso del Directorio • Versión 1.0 (2026)
            </p>
          </div>
        </div>

        <section className="space-y-4 text-sm text-[#15385F]/90 leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2">
            1. Propósito y Espíritu Comunitario
          </h2>
          <p>
            La Cámara Chilena de Inteligencia Artificial A.G. (CCHIA) reúne a 132 organizaciones y especialistas
            comprometidos con el desarrollo ético, responsable y productivo de la IA en Chile.
            El presente acuerdo establece las bases de lealtad, confianza mutua y respeto entre todos los socios miembros.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            2. Uso de la Información de Contacto
          </h2>
          <p>
            Los datos de contacto provistos en el directorio son puestos a disposición para fines de vinculación profesional, comercial legítima y asociativa. Queda expresamente prohibido:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Utilizar el directorio para prácticas de spam masivo, minería no consentida o comercialización de bases de datos.</li>
            <li>Divulgar como confidencial aquella información que los socios han marcado públicamente para su tarjeta.</li>
            <li>Suplantar la identidad de otro socio o modificar sin autorización atributos de otras organizaciones.</li>
          </ul>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            3. Información Técnica e Intercambio Gremial
          </h2>
          <p>
            Cualquier intercambio de metodologías, datos internos, algoritmos propietarios o proyectos en desarrollo que ocurra en el marco de las actividades y mesas técnicas de la CCHIA deberá ser tratado bajo estricto secreto profesional por los miembros participantes, salvo autorización expresa y escrita del titular.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#15385F] border-b pb-2 pt-4">
            4. Vigencia y Compromiso Digital
          </h2>
          <p>
            La aceptación de este acuerdo se perfecciona digitalmente en el proceso de inicio de sesión de la plataforma, quedando registrada la fecha, hora y versión en el perfil del socio.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center not-prose">
          <Link
            to="/ingresar"
            className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-xs bg-[#15385F] text-white hover:bg-[#0E2540] transition"
          >
            Aceptar y Continuar al Ingreso
          </Link>
        </div>
      </article>
    </div>
  );
};
