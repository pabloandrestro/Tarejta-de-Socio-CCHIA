import React, { useState, useMemo } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { Card, CardStatus, CATEGORIES, MEMBER_TYPES, Category, MemberType } from '../types';
import { useSEO } from '../utils/seo';
import {
  ShieldCheck,
  Download,
  Upload,
  Eye,
  CheckCircle,
  EyeOff,
  Edit,
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  Layers,
  FileSpreadsheet,
  Check,
  X,
  RefreshCw,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const {
    cards,
    currentUser,
    updateCardStatus,
    adminUpdateCard,
    exportToCSV,
    importFromCSV,
    switchRole,
    resetToSampleData
  } = useDirectory();

  useSEO({
    title: 'Panel de Administración | Directorio CCHIA',
    description: 'Panel de administración y moderación de tarjetas del Directorio CCHIA.',
  });

  // Filters for the table
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [ocultarCardId, setOcultarCardId] = useState<string | null>(null);
  const [motivoOcultar, setMotivoOcultar] = useState('');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [importStatus, setImportStatus] = useState<{ imported: number; errors: string[] } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // KPIs
  const stats = useMemo(() => {
    const total = cards.length;
    const publicadas = cards.filter(c => c.estado === 'Publicada').length;
    const enRevision = cards.filter(c => c.estado === 'En revisión').length;
    const ocultas = cards.filter(c => c.estado === 'Oculta').length;
    const conCambiosPendientes = cards.filter(c => c.revisarCambios).length;

    // Counts by type
    const byType: Record<string, number> = {};
    MEMBER_TYPES.forEach(t => {
      byType[t] = cards.filter(c => c.tipo === t).length;
    });

    // Counts by category
    const byCategory: Record<string, number> = {};
    CATEGORIES.forEach(c => {
      byCategory[c] = cards.filter(card => card.categoria === c).length;
    });

    return { total, publicadas, enRevision, ocultas, conCambiosPendientes, byType, byCategory };
  }, [cards]);

  // Filtered list
  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      if (statusFilter !== 'todos' && c.estado !== statusFilter) return false;
      if (typeFilter !== 'todos' && c.tipo !== typeFilter) return false;
      if (categoryFilter !== 'todas' && c.categoria !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = c.nombre.toLowerCase().includes(q);
        const mTitle = c.titulo.toLowerCase().includes(q);
        const mEmail = c.email.toLowerCase().includes(q);
        const mContact = c.contactoNombre.toLowerCase().includes(q);
        if (!mName && !mTitle && !mEmail && !mContact) return false;
      }
      return true;
    });
  }, [cards, statusFilter, typeFilter, categoryFilter, searchQuery]);

  // Actions
  const handlePublish = async (cardId: string) => {
    await updateCardStatus(cardId, 'Publicada');
    setActionSuccess('Tarjeta publicada exitosamente.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const confirmOcultar = async () => {
    if (!ocultarCardId) return;
    await updateCardStatus(ocultarCardId, 'Oculta', motivoOcultar.trim() || 'Moderada por administración');
    setOcultarCardId(null);
    setMotivoOcultar('');
    setActionSuccess('Tarjeta ocultada.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleExportCSV = () => {
    const csvData = exportToCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `socios_cchia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importFromCSV(content);
        setImportStatus(res);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Ensure Admin role for demo preview
  if (currentUser?.rol !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-[#15385F]">
          Acceso Exclusivo de Administrador CCHIA
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Esta sección está reservada para el equipo directivo de la Cámara Chilena de Inteligencia Artificial A.G.
        </p>
        <div className="mt-6">
          <button
            onClick={() => switchRole('admin')}
            className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition shadow-xs cursor-pointer"
          >
            Activar Modo Administrador (Prueba)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-[#15385F] text-white">
              <ShieldCheck className="w-5 h-5 text-[#1C92A0]" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#15385F] tracking-tight">
              Panel de Administración CCHIA
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#157A86] font-medium">
            Gestión de moderación, estados, exportación e importación de socios 2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Exportar CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-[#CBD5E1] text-[#15385F] hover:bg-[#F7F9FB] transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
            Exportar CSV
          </button>

          {/* Importar CSV */}
          <label className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
            Importar Google Forms (CSV)
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <button
            onClick={resetToSampleData}
            title="Restablecer tarjetas a los 3 ejemplos oficiales"
            className="p-2 rounded-lg text-xs border border-[#CBD5E1] bg-white text-[#64748B] hover:text-[#15385F]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {importStatus && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">
              Resultado de Importación: {importStatus.imported} tarjetas incorporadas.
            </span>
            <button
              onClick={() => setImportStatus(null)}
              className="text-blue-700 hover:text-blue-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {importStatus.errors.length > 0 && (
            <ul className="list-disc pl-5 text-[11px] text-amber-800 space-y-0.5">
              {importStatus.errors.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Indicadores (KPIs) - Requisito 9 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
            Total con Tarjeta
          </span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-[#15385F] mt-1 block">
            {stats.total}
          </span>
          <span className="text-[11px] text-[#157A86] mt-0.5 block">
            de 132 socios CCHIA
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Publicadas
          </span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-600 mt-1 block">
            {stats.publicadas}
          </span>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">
            visibles en /directorio
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
            En Revisión
          </span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-blue-600 mt-1 block">
            {stats.enRevision}
          </span>
          <span className="text-[11px] text-blue-700 mt-0.5 block">
            pendientes de aprobación
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            Cambios Pendientes
          </span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-amber-600 mt-1 block">
            {stats.conCambiosPendientes}
          </span>
          <span className="text-[11px] text-amber-700 mt-0.5 block">
            editadas por socios
          </span>
        </div>
      </div>

      {/* Desglose por Tipo y Categoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#15385F] mb-3 flex items-center">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
            Conteo por Tipo de Socio
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {MEMBER_TYPES.map(t => (
              <div key={t} className="p-2.5 rounded-lg bg-[#F7F9FB] border border-[#E2E8F0] text-center">
                <span className="block text-xs font-medium text-[#64748B]">{t}</span>
                <span className="block text-lg font-bold text-[#15385F] mt-0.5">
                  {stats.byType[t] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#15385F] mb-3 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
            Distribución por Categorías Clave
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {CATEGORIES.slice(0, 6).map(c => (
              <div key={c} className="p-2 rounded-lg bg-[#EBF8FA] border border-[#BDE7EC] text-center truncate">
                <span className="block text-[11px] text-[#157A86] truncate" title={c}>{c}</span>
                <span className="block font-bold text-[#15385F]">{stats.byCategory[c] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros de la Tabla */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-xs mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Búsqueda */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por socio, servicio o email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#15385F] focus:ring-1 focus:ring-[#1C92A0]"
            />
          </div>

          {/* Estado */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#15385F] bg-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="Publicada">Publicada</option>
              <option value="En revisión">En revisión</option>
              <option value="Borrador">Borrador</option>
              <option value="Oculta">Oculta</option>
            </select>
          </div>

          {/* Tipo */}
          <div className="sm:col-span-2">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#15385F] bg-white"
            >
              <option value="todos">Todos los tipos</option>
              {MEMBER_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#15385F] bg-white"
            >
              <option value="todas">Todas las categorías</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Tarjetas */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E2E8F0] text-left text-xs">
            <thead className="bg-[#F7F9FB] text-[#15385F] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Socio</th>
                <th className="py-3 px-4">Tipo & Categoría</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#15385F]">
              {filteredCards.length > 0 ? (
                filteredCards.map(card => (
                  <tr key={card.id} className="hover:bg-[#F7F9FB]/60 transition">
                    {/* Socio */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {card.logoUrl ? (
                          <img
                            src={card.logoUrl}
                            alt=""
                            className="w-8 h-8 rounded-md object-contain border border-gray-200 p-0.5 bg-white shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-[#15385F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {card.nombre.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-[#15385F] flex items-center space-x-1.5">
                            <span>{card.nombre}</span>
                            {card.revisarCambios && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800" title="El socio modificó el texto de su tarjeta publicada">
                                Cambios
                              </span>
                            )}
                          </div>
                          <p className="text-[#157A86] line-clamp-1 text-[11px] max-w-xs">{card.titulo}</p>
                          <span className="text-[10px] text-gray-400">/{card.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tipo & Categoría */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-800 mr-1.5">
                        {card.tipo}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBF8FA] text-[#157A86]">
                        {card.categoria}
                      </span>
                    </td>

                    {/* Contacto */}
                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="font-medium text-[#15385F]">{card.contactoNombre}</div>
                      <div className="text-[#64748B]">{card.email}</div>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          card.estado === 'Publicada'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : card.estado === 'En revisión'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : card.estado === 'Oculta'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {card.estado}
                      </span>
                      {card.motivoOculto && (
                        <p className="text-[10px] text-red-600 mt-0.5 italic">
                          Motivo: {card.motivoOculto}
                        </p>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Ver */}
                      <Link
                        to={`/directorio/${card.slug}`}
                        target="_blank"
                        className="inline-flex items-center p-1.5 rounded text-[#15385F] hover:bg-gray-100"
                        title="Ver tarjeta"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Publicar */}
                      {card.estado !== 'Publicada' && (
                        <button
                          onClick={() => handlePublish(card.id)}
                          className="inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                          title="Publicar en el directorio"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Publicar
                        </button>
                      )}

                      {/* Ocultar */}
                      {card.estado === 'Publicada' && (
                        <button
                          onClick={() => setOcultarCardId(card.id)}
                          className="inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          title="Ocultar del directorio"
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Ocultar
                        </button>
                      )}

                      {/* Editar (Admin) */}
                      <button
                        onClick={() => setEditingCard(card)}
                        className="inline-flex items-center p-1.5 rounded text-[#157A86] hover:bg-[#EBF8FA]"
                        title="Editar datos de esta tarjeta"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#64748B]">
                    No hay tarjetas que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ocultar con Motivo (Requisito 9) */}
      {ocultarCardId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#15385F]">
              Ocultar Tarjeta del Directorio
            </h3>
            <p className="text-xs text-[#64748B]">
              Indica el motivo por el cual esta tarjeta no debe estar visible para el público.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#15385F] mb-1">
                Motivo de ocultamiento
              </label>
              <textarea
                rows={3}
                required
                value={motivoOcultar}
                onChange={e => setMotivoOcultar(e.target.value)}
                placeholder="ej. Membresía pendiente de pago, datos de contacto no vigentes..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] focus:ring-1 focus:ring-[#1C92A0]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setOcultarCardId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmOcultar}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
              >
                Confirmar y Ocultar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edición Rápida de Administrador */}
      {editingCard && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-heading font-bold text-base text-[#15385F]">
                Editar Tarjeta como Administrador CCHIA
              </h3>
              <button onClick={() => setEditingCard(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingCard.nombre}
                  onChange={e => setEditingCard({ ...editingCard, nombre: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Título del servicio (máx 80)</label>
                <input
                  type="text"
                  maxLength={80}
                  value={editingCard.titulo}
                  onChange={e => setEditingCard({ ...editingCard, titulo: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Descripción (máx 300)</label>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={editingCard.descripcion}
                  onChange={e => setEditingCard({ ...editingCard, descripcion: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tipo</label>
                  <select
                    value={editingCard.tipo}
                    onChange={e => setEditingCard({ ...editingCard, tipo: e.target.value as MemberType })}
                    className="w-full p-2 border rounded bg-white"
                  >
                    {MEMBER_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Categoría</label>
                  <select
                    value={editingCard.categoria}
                    onChange={e => setEditingCard({ ...editingCard, categoria: e.target.value as Category })}
                    className="w-full p-2 border rounded bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Email de contacto</label>
                  <input
                    type="email"
                    value={editingCard.email}
                    onChange={e => setEditingCard({ ...editingCard, email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Estado</label>
                  <select
                    value={editingCard.estado}
                    onChange={e => setEditingCard({ ...editingCard, estado: e.target.value as CardStatus })}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Publicada">Publicada</option>
                    <option value="Oculta">Oculta</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (editingCard) {
                    await adminUpdateCard(editingCard.id, editingCard);
                    setEditingCard(null);
                    setActionSuccess('Tarjeta actualizada por administración.');
                    setTimeout(() => setActionSuccess(null), 3000);
                  }
                }}
                className="px-4 py-1.5 rounded text-xs font-bold bg-[#1C92A0] text-white hover:bg-[#157A86]"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
