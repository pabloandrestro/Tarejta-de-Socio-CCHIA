import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDirectory } from '../context/DirectoryContext';
import { CardPreview } from '../components/CardPreview';
import { CATEGORIES, MEMBER_TYPES, Category, MemberType, Card, CopySuggestion } from '../types';
import { useSEO } from '../utils/seo';
import {
  Sparkles,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Info,
  Clock,
  Check,
  X
} from 'lucide-react';

export const CardFormPage: React.FC = () => {
  const { currentUser, getUserCard, saveUserCard } = useDirectory();
  const navigate = useNavigate();

  useSEO({
    title: 'Mi Tarjeta de Socio | Directorio CCHIA',
    description: 'Gestiona tu tarjeta en el Directorio oficial de la Cámara Chilena de Inteligencia Artificial.',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/ingresar');
    }
  }, [currentUser, navigate]);

  const existingCard = getUserCard();

  // Form State in exact specified order:
  // 1. tipo (Empresa / Institución / Profesional)
  // 2. nombre
  // 3. titulo (máx 80)
  // 4. categoria
  // 5. descripcion (máx 300)
  // 6. logoUrl (JPG, PNG, WebP, máx 5MB)
  // 7. contactoNombre
  // 8. email
  // 9. telefono + mostrarTelefono
  // 10. web
  // 11. linkedin
  // 12. instagram
  // 13. otroEnlace
  const [tipo, setTipo] = useState<MemberType>(existingCard?.tipo || 'Empresa');
  const [nombre, setNombre] = useState(existingCard?.nombre || (currentUser?.nombre !== 'Socio CCHIA' ? currentUser?.nombre || '' : ''));
  const [titulo, setTitulo] = useState(existingCard?.titulo || '');
  const [categoria, setCategoria] = useState<Category>(existingCard?.categoria || 'IA generativa');
  const [descripcion, setDescripcion] = useState(existingCard?.descripcion || '');
  const [logoUrl, setLogoUrl] = useState(existingCard?.logoUrl || '');
  const [contactoNombre, setContactoNombre] = useState(existingCard?.contactoNombre || currentUser?.nombre || '');
  const [email, setEmail] = useState(existingCard?.email || currentUser?.email || '');
  const [telefono, setTelefono] = useState(existingCard?.telefono || '');
  const [mostrarTelefono, setMostrarTelefono] = useState(existingCard?.mostrarTelefono ?? false);
  const [web, setWeb] = useState(existingCard?.web || '');
  const [linkedin, setLinkedin] = useState(existingCard?.linkedin || '');
  const [instagram, setInstagram] = useState(existingCard?.instagram || '');
  const [otroEnlace, setOtroEnlace] = useState(existingCard?.otroEnlace || '');

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Gemini Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<CopySuggestion | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync when card loads
  useEffect(() => {
    if (existingCard) {
      setTipo(existingCard.tipo);
      setNombre(existingCard.nombre);
      setTitulo(existingCard.titulo);
      setCategoria(existingCard.categoria);
      setDescripcion(existingCard.descripcion);
      setLogoUrl(existingCard.logoUrl || '');
      setContactoNombre(existingCard.contactoNombre);
      setEmail(existingCard.email);
      setTelefono(existingCard.telefono || '');
      setMostrarTelefono(existingCard.mostrarTelefono);
      setWeb(existingCard.web || '');
      setLinkedin(existingCard.linkedin || '');
      setInstagram(existingCard.instagram || '');
      setOtroEnlace(existingCard.otroEnlace || '');
    }
  }, [existingCard]);

  // Handle Logo Upload (JPG, PNG, WebP, max 5MB)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('El logo debe estar en formato JPG, PNG o WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('El archivo no debe exceder 5 MB de tamaño.');
      return;
    }

    setFormError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Call Gemini Assistant server-side
  const handleImproveCopy = async () => {
    if (!titulo.trim() && !descripcion.trim()) {
      setAiError('Escribe al menos un título o descripción para que Gemini pueda sugerir mejoras.');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/mejorar-redaccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion,
          tipo,
          categoria,
          nombre
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo conectar con el asistente de redacción.');
      }

      const data: CopySuggestion = await response.json();
      setAiSuggestion(data);
    } catch (err: any) {
      setAiError(err.message || 'Error al solicitar sugerencia a Gemini.');
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAiSuggestion = () => {
    if (aiSuggestion) {
      setTitulo(aiSuggestion.titulo.slice(0, 80));
      setDescripcion(aiSuggestion.descripcion.slice(0, 300));
      setAiSuggestion(null);
    }
  };

  const discardAiSuggestion = () => {
    setAiSuggestion(null);
  };

  // Validations & Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaveSuccess(null);

    // Validaciones obligatorias
    if (!nombre.trim()) {
      setFormError('El nombre de la empresa, institución o persona es obligatorio.');
      return;
    }
    if (!titulo.trim()) {
      setFormError('El título del servicio es obligatorio (máx. 80 caracteres).');
      return;
    }
    if (titulo.length > 80) {
      setFormError('El título del servicio no puede exceder los 80 caracteres.');
      return;
    }
    if (!descripcion.trim()) {
      setFormError('La descripción es obligatoria (máx. 300 caracteres).');
      return;
    }
    if (descripcion.length > 300) {
      setFormError('La descripción no puede exceder los 300 caracteres.');
      return;
    }
    if (!contactoNombre.trim()) {
      setFormError('El nombre y apellido de la persona de contacto es obligatorio.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Debes ingresar un correo electrónico válido.');
      return;
    }
    if (web && !web.startsWith('http://') && !web.startsWith('https://')) {
      setFormError('La página web debe comenzar con https:// o http://');
      return;
    }

    try {
      setSaving(true);
      const saved = await saveUserCard({
        tipo,
        nombre: nombre.trim(),
        titulo: titulo.trim(),
        categoria,
        descripcion: descripcion.trim(),
        logoUrl,
        contactoNombre: contactoNombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        mostrarTelefono,
        web: web.trim(),
        linkedin: linkedin.trim(),
        instagram: instagram.trim(),
        otroEnlace: otroEnlace.trim(),
      });

      setSaveSuccess(
        existingCard && existingCard.estado === 'Publicada'
          ? 'Tus cambios han sido actualizados en tu tarjeta pública y notificados a moderación CCHIA.'
          : 'Tu tarjeta ha sido guardada exitosamente y enviada para revisión del administrador CCHIA.'
      );
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar la tarjeta.');
    } finally {
      setSaving(false);
    }
  };

  // Preview card live object
  const currentCardState: Partial<Card> = {
    tipo,
    nombre: nombre || 'Nombre de tu organización o profesional',
    titulo: titulo || 'Título del servicio o especialidad técnica',
    categoria,
    descripcion: descripcion || 'Tu descripción aparecerá aquí tal como la verán los visitantes del directorio oficial.',
    logoUrl,
    contactoNombre: contactoNombre || 'Nombre y apellido',
    email: email || 'contacto@ejemplo.cl',
    telefono,
    mostrarTelefono,
    web,
    linkedin,
    instagram,
    otroEnlace,
    estado: existingCard ? existingCard.estado : 'En revisión',
    slug: existingCard?.slug || 'vista-previa'
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#15385F] tracking-tight">
              Gestor de Tarjeta CCHIA
            </h1>
            <p className="mt-1 text-sm text-[#157A86] font-medium">
              Completa los datos de tu tarjeta en menos de 5 minutos para el directorio oficial 2026.
            </p>
          </div>

          {existingCard && (
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  existingCard.estado === 'Publicada'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : existingCard.estado === 'En revisión'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5 mr-1" />
                Estado: {existingCard.estado}
              </span>

              {existingCard.estado === 'Publicada' && (
                <Link
                  to={`/directorio/${existingCard.slug}`}
                  target="_blank"
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-[#CBD5E1] text-[#15385F] hover:bg-[#F7F9FB] transition shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-[#1C92A0]" />
                  Ver pública
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{saveSuccess}</p>
            {existingCard && (
              <p className="mt-1 text-xs">
                Enlace directo:{' '}
                <Link
                  to={`/directorio/${existingCard.slug}`}
                  className="underline font-semibold hover:text-emerald-900"
                >
                  {window.location.origin}/directorio/{existingCard.slug}
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* Grid: Formulario a la izquierda, Vista Previa en Vivo a la derecha (en móvil debajo) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Formulario (7 columnas en desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Tipo de socio* */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-2">
                1. Tipo de socio *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {MEMBER_TYPES.map(t => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition text-center ${
                      tipo === t
                        ? 'bg-[#15385F] text-white border-[#15385F] shadow-xs'
                        : 'bg-white text-[#15385F] border-[#CBD5E1] hover:bg-[#F7F9FB]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Nombre* */}
            <div>
              <label htmlFor="card-nombre" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                2. Nombre * (empresa, institución o persona)
              </label>
              <input
                id="card-nombre"
                type="text"
                required
                maxLength={120}
                placeholder="ej. Lumen Data SpA o Daniela Soto Ríos"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* 3. Título del servicio* (máx. 80 caracteres) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="card-titulo" className="block text-xs font-bold uppercase tracking-wider text-[#15385F]">
                  3. Título del servicio * (máx. 80 caracteres)
                </label>
                <span className={`text-xs ${titulo.length > 70 ? 'text-amber-600 font-bold' : 'text-[#64748B]'}`}>
                  {titulo.length}/80
                </span>
              </div>
              <input
                id="card-titulo"
                type="text"
                required
                maxLength={80}
                placeholder="ej. Soluciones de Realidades Extendidas o Analítica Predictiva"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* 4. Categoría* */}
            <div>
              <label htmlFor="card-categoria" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                4. Categoría * (una opción)
              </label>
              <select
                id="card-categoria"
                value={categoria}
                onChange={e => setCategoria(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] bg-white focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Descripción* (máx. 300 caracteres, con contador) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="card-descripcion" className="block text-xs font-bold uppercase tracking-wider text-[#15385F]">
                  5. Descripción * (máx. 300 caracteres)
                </label>
                <span className={`text-xs ${descripcion.length > 270 ? 'text-amber-600 font-bold' : 'text-[#64748B]'}`}>
                  {descripcion.length}/300
                </span>
              </div>
              <textarea
                id="card-descripcion"
                required
                rows={3}
                maxLength={300}
                placeholder="Describe tus soluciones tecnológicas, experiencia y valor diferencial..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20 resize-none"
              />

              {/* Botón Asistente con Gemini: Mejorar Redacción (Requirement 5) */}
              <div className="mt-2.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleImproveCopy}
                  disabled={aiLoading}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-[#EBF8FA] text-[#157A86] hover:bg-[#1C92A0] hover:text-white border border-[#BDE7EC] transition shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {aiLoading ? 'Analizando con Gemini...' : 'Mejorar redacción con Gemini'}
                </button>
                <span className="text-[11px] text-[#64748B]">
                  Revisa ortografía, síntesis y límites
                </span>
              </div>

              {aiError && (
                <p className="mt-2 text-xs text-red-600">
                  {aiError}
                </p>
              )}

              {/* Sugerencia propuesta por Gemini (Requiere aceptación explícita) */}
              {aiSuggestion && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#F7F9FB] to-[#EBF8FA] border-2 border-[#1C92A0] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-bold text-[#15385F]">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-[#1C92A0]" />
                      Propuesta de mejora de redacción
                    </span>
                    <span className="text-[11px] text-[#157A86] font-medium">
                      Gemini 3.8 Flash
                    </span>
                  </div>

                  <p className="text-xs text-[#15385F]/80 italic">
                    «{aiSuggestion.explicacion}»
                  </p>

                  <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
                    <div>
                      <strong className="text-[#15385F]">Título sugerido ({aiSuggestion.titulo.length}/80):</strong>
                      <p className="text-[#157A86] font-medium mt-0.5">{aiSuggestion.titulo}</p>
                    </div>
                    <div>
                      <strong className="text-[#15385F]">Descripción sugerida ({aiSuggestion.descripcion.length}/300):</strong>
                      <p className="text-[#15385F]/90 mt-0.5">{aiSuggestion.descripcion}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={acceptAiSuggestion}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#1C92A0] text-white hover:bg-[#157A86] transition shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Aceptar sugerencia
                    </button>
                    <button
                      type="button"
                      onClick={discardAiSuggestion}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-white text-[#64748B] hover:text-[#15385F] border border-[#CBD5E1]"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Descartar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Logo o foto (JPG, PNG o WebP, máx. 5 MB) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                6. Logo o foto (JPG, PNG o WebP, máx. 5 MB)
              </label>
              <div className="flex items-center space-x-4">
                {logoUrl ? (
                  <div className="relative">
                    <img
                      src={logoUrl}
                      alt="Vista previa del logo"
                      className="w-16 h-16 rounded-xl object-contain border border-[#CBD5E1] p-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                      title="Eliminar logo"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#F1F5F9] border border-dashed border-[#94A3B8] flex items-center justify-center text-xs text-[#64748B] text-center p-1">
                    Sin logo
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    id="logo-upload-input"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-[#CBD5E1] text-[#15385F] hover:bg-[#F7F9FB] cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
                    {logoUrl ? 'Cambiar imagen' : 'Subir archivo de logo'}
                  </label>
                  <p className="mt-1 text-[11px] text-[#64748B]">
                    Si no subes logo, se mostrará un círculo con la inicial de tu nombre.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Persona de contacto* (nombre y apellido) */}
            <div>
              <label htmlFor="card-contacto" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                7. Persona de contacto * (nombre y apellido)
              </label>
              <input
                id="card-contacto"
                type="text"
                required
                maxLength={120}
                placeholder="ej. Rodrigo Araya Morales"
                value={contactoNombre}
                onChange={e => setContactoNombre(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* 8. Email* (validado) */}
            <div>
              <label htmlFor="card-email" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                8. Email * (validado)
              </label>
              <input
                id="card-email"
                type="email"
                required
                placeholder="ej. contacto@lumendata.cl"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* 9. Teléfono (opcional) + casilla "Mostrar teléfono en la tarjeta pública" */}
            <div className="space-y-2">
              <label htmlFor="card-telefono" className="block text-xs font-bold uppercase tracking-wider text-[#15385F]">
                9. Teléfono (opcional)
              </label>
              <input
                id="card-telefono"
                type="tel"
                placeholder="ej. +56 9 8765 4321"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
              <div className="flex items-center space-x-2 pt-1">
                <input
                  id="card-mostrar-tel"
                  type="checkbox"
                  checked={mostrarTelefono}
                  onChange={e => setMostrarTelefono(e.target.checked)}
                  className="w-4 h-4 text-[#1C92A0] rounded border-gray-300 focus:ring-[#1C92A0]"
                />
                <label htmlFor="card-mostrar-tel" className="text-xs text-[#15385F] select-none cursor-pointer">
                  Mostrar teléfono en la tarjeta pública
                </label>
              </div>
            </div>

            {/* 10. Página web (URL validada) */}
            <div>
              <label htmlFor="card-web" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                10. Página web (URL validada)
              </label>
              <input
                id="card-web"
                type="url"
                placeholder="https://tuempresa.cl"
                value={web}
                onChange={e => setWeb(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
              <p className="mt-1 text-[11px] text-[#64748B]">
                Tu enlace web se publica de forma directa (sin nofollow) para favorecer el SEO de tu organización.
              </p>
            </div>

            {/* 11. LinkedIn */}
            <div>
              <label htmlFor="card-linkedin" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                11. LinkedIn
              </label>
              <input
                id="card-linkedin"
                type="url"
                placeholder="https://linkedin.com/company/tu-empresa o in/tu-perfil"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* 12. Instagram */}
            <div>
              <label htmlFor="card-instagram" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                12. Instagram
              </label>
              <input
                id="card-instagram"
                type="url"
                placeholder="https://instagram.com/tu-usuario"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* 13. Otro enlace */}
            <div>
              <label htmlFor="card-otro" className="block text-xs font-bold uppercase tracking-wider text-[#15385F] mb-1.5">
                13. Otro enlace (video, portafolio u otra red)
              </label>
              <input
                id="card-otro"
                type="url"
                placeholder="https://vimeo.com/... o https://github.com/..."
                value={otroEnlace}
                onChange={e => setOtroEnlace(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#15385F] focus:border-[#1C92A0] focus:ring-2 focus:ring-[#1C92A0]/20"
              />
            </div>

            {/* Botón Guardar Tarjeta */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm bg-[#1C92A0] text-white hover:bg-[#157A86] transition shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando tarjeta...' : 'Guardar tarjeta'}
              </button>

              <span className="text-xs text-[#64748B] text-center sm:text-right">
                {existingCard?.estado === 'Publicada'
                  ? 'Los cambios se publican inmediatamente y se reportan a moderación.'
                  : 'Al guardar por primera vez, tu tarjeta queda «En revisión».'}
              </span>
            </div>
          </form>
        </div>

        {/* Columna Vista Previa en Vivo (5 columnas en desktop, fija / sticky) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#15385F] flex items-center">
              <Eye className="w-4 h-4 mr-1.5 text-[#1C92A0]" />
              Vista previa en vivo
            </span>
            <span className="text-xs text-[#64748B]">
              Así se verá en el directorio
            </span>
          </div>

          <CardPreview card={currentCardState} isFullPage={false} />

          <div className="bg-[#EBF8FA] p-3.5 rounded-xl border border-[#BDE7EC] text-xs text-[#157A86] leading-relaxed">
            <p className="font-semibold text-[#15385F] mb-1">
              ¿Por qué completar tu tarjeta?
            </p>
            Permite que clientes, socios del ecosistema y fondos reconozcan las capacidades
            de tu organización con una URL pública exclusiva en el directorio CCHIA.
          </div>
        </div>
      </div>
    </div>
  );
};
