import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDirectory } from '../context/DirectoryContext';
import { useSEO } from '../utils/seo';
import { ShieldCheck, Lock, ExternalLink, CheckSquare, Square, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, currentUser } = useDirectory();
  const navigate = useNavigate();

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [confidentialityAccepted, setConfidentialityAccepted] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'linkedin' | null>(null);

  useSEO({
    title: 'Ingreso de Socios | Directorio CCHIA',
    description: 'Acceso para socios de la Cámara Chilena de Inteligencia Artificial A.G. Crea y administra tu tarjeta oficial.',
  });

  const canProceed = privacyAccepted && confidentialityAccepted;

  const handleProviderLogin = async (provider: 'google' | 'linkedin') => {
    if (!canProceed) {
      setError('Debes aceptar obligatoriamente ambas casillas antes de continuar.');
      return;
    }

    try {
      setError(null);
      setLoadingProvider(provider);
      await login(
        provider,
        { privacy: privacyAccepted, confidentiality: confidentialityAccepted },
        customEmail.trim() || undefined,
        customName.trim() || undefined
      );
      navigate('/mi-tarjeta');
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10">
        {/* Header CCHIA */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#15385F] text-white flex items-center justify-center font-heading font-black text-xl mx-auto border-2 border-[#1C92A0] mb-4">
            CC<span className="text-[#1C92A0]">IA</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#15385F] tracking-tight">
            Ingreso de Socios CCHIA
          </h1>

          {/* Texto obligatorio especificado en el requisito 4 */}
          <p className="mt-3 text-sm text-[#157A86] font-medium leading-relaxed max-w-md mx-auto">
            Google o LinkedIn identifican tu cuenta. La tarjeta del directorio la armas después, y solo tú la editas.
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Casillas de consentimiento legal obligatorias (Requisito 4) */}
        <div className="mt-8 space-y-4 bg-[#F7F9FB] p-5 rounded-xl border border-[#E2E8F0]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#15385F]">
            Consentimientos obligatorios
          </h2>

          {/* Casilla 1: Ley 21.719 */}
          <div className="flex items-start space-x-3">
            <input
              id="privacy-consent"
              type="checkbox"
              checked={privacyAccepted}
              onChange={e => setPrivacyAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#1C92A0] rounded border-gray-300 focus:ring-[#1C92A0]"
            />
            <label htmlFor="privacy-consent" className="text-xs sm:text-sm text-[#15385F] leading-snug cursor-pointer select-none">
              Acepto la política de privacidad y protección de datos, conforme a la{' '}
              <Link
                to="/privacidad"
                target="_blank"
                className="font-semibold text-[#1C92A0] hover:text-[#157A86] underline inline-flex items-center"
              >
                Ley N.° 21.719
                <ExternalLink className="w-3 h-3 ml-0.5 inline" />
              </Link>
              .
            </label>
          </div>

          {/* Casilla 2: Confidencialidad CCHIA */}
          <div className="flex items-start space-x-3">
            <input
              id="confidentiality-consent"
              type="checkbox"
              checked={confidentialityAccepted}
              onChange={e => setConfidentialityAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#1C92A0] rounded border-gray-300 focus:ring-[#1C92A0]"
            />
            <label htmlFor="confidentiality-consent" className="text-xs sm:text-sm text-[#15385F] leading-snug cursor-pointer select-none">
              Acepto el acuerdo de confidencialidad de la comunidad CCHIA.{' '}
              <Link
                to="/confidencialidad"
                target="_blank"
                className="font-semibold text-[#1C92A0] hover:text-[#157A86] underline inline-flex items-center"
              >
                (Ver acuerdo)
                <ExternalLink className="w-3 h-3 ml-0.5 inline" />
              </Link>
            </label>
          </div>

          <div className="pt-2 text-[11px] text-[#64748B]">
            * Se registrará digitalmente la fecha, hora exacta y versión vigente de ambas políticas en tu perfil.
          </div>
        </div>

        {/* Opcional: Personalizar email y nombre para vincular tarjeta existente */}
        <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
          <details className="text-xs text-[#64748B] cursor-pointer">
            <summary className="font-medium text-[#157A86] hover:text-[#15385F]">
              ¿Tienes una tarjeta precargada por la CCHIA? Haz clic para ingresar tu email
            </summary>
            <div className="mt-3 p-3 bg-white rounded-lg border border-[#E2E8F0] space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#15385F] mb-1">
                  Tu correo registrado en la Cámara
                </label>
                <input
                  type="email"
                  placeholder="ej. contacto@lumendata.cl"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#15385F] mb-1">
                  Tu nombre y apellido
                </label>
                <input
                  type="text"
                  placeholder="ej. Rodrigo Araya"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded border border-[#CBD5E1]"
                />
              </div>
            </div>
          </details>
        </div>

        {/* Botones de Proveedores de Autenticación (Requisito 4) */}
        <div className="mt-6 space-y-3">
          {/* Continuar con Google */}
          <button
            onClick={() => handleProviderLogin('google')}
            disabled={!canProceed || loadingProvider !== null}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-3 transition border ${
              canProceed
                ? 'bg-white border-[#CBD5E1] text-[#15385F] hover:bg-[#F7F9FB] shadow-2xs cursor-pointer'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Continuar con LinkedIn */}
          <button
            onClick={() => handleProviderLogin('linkedin')}
            disabled={!canProceed || loadingProvider !== null}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-3 transition border ${
              canProceed
                ? 'bg-[#0A66C2] border-[#0A66C2] text-white hover:bg-[#004182] shadow-2xs cursor-pointer'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>Continuar con LinkedIn</span>
          </button>
        </div>

        {!canProceed && (
          <p className="text-center text-xs text-amber-700 mt-4 bg-amber-50 py-2 px-3 rounded-md border border-amber-200">
            Marca las dos casillas obligatorias arriba para activar el ingreso.
          </p>
        )}
      </div>
    </div>
  );
};
