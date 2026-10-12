import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, CardStatus, UserProfile, UserRole } from '../types';
import { INITIAL_CARDS } from '../data/initialCards';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';

interface DirectoryContextType {
  cards: Card[];
  publishedCards: Card[];
  currentUser: UserProfile | null;
  loading: boolean;
  login: (provider: 'google' | 'linkedin', consent: { privacy: boolean; confidentiality: boolean }, userEmail?: string, userName?: string) => Promise<UserProfile>;
  logout: () => void;
  saveUserCard: (cardData: Partial<Card>) => Promise<Card>;
  adminUpdateCard: (cardId: string, updates: Partial<Card>) => Promise<Card>;
  updateCardStatus: (cardId: string, newStatus: CardStatus, motivoOculto?: string) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  getUserCard: () => Card | undefined;
  getCardBySlug: (slug: string) => Card | undefined;
  exportToCSV: () => string;
  importFromCSV: (csvContent: string) => Promise<{ imported: number; errors: string[] }>;
  switchRole: (role: UserRole) => void;
  resetToSampleData: () => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

const STORAGE_CARDS_KEY = 'cchia_directory_cards_v1';
const STORAGE_USER_KEY = 'cchia_directory_user_v1';

export const DirectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CARDS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_CARDS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Guardar tarjetas en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(cards));
    } catch (e) {
      console.warn('Error saving cards to localStorage', e);
    }
  }, [cards]);

  // Guardar usuario en localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (e) {
      console.warn('Error saving user to localStorage', e);
    }
  }, [currentUser]);

  const publishedCards = cards.filter(c => c.estado === 'Publicada');

  const login = async (
    provider: 'google' | 'linkedin',
    consent: { privacy: boolean; confidentiality: boolean },
    customEmail?: string,
    customName?: string
  ): Promise<UserProfile> => {
    if (!consent.privacy || !consent.confidentiality) {
      throw new Error('Debes aceptar ambas políticas obligatorias para continuar.');
    }

    const now = new Date().toISOString();
    const email = customEmail || (provider === 'google' ? 'socio.ejemplo@empresa-ia.cl' : 'profesional.ejemplo@ia-chile.cl');
    const nombre = customName || (provider === 'google' ? 'Socio CCHIA' : 'Profesional CCHIA');
    const uid = 'usr_' + Math.random().toString(36).substring(2, 10);

    const profile: UserProfile = {
      uid,
      email,
      nombre,
      rol: 'socio',
      proveedor: provider,
      fotoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nombre)}&backgroundColor=15385F`,
      aceptoPrivacidad: {
        fecha: now,
        version: 'Ley N.° 21.719 - v1.0'
      },
      aceptoConfidencialidad: {
        fecha: now,
        version: 'Acuerdo Confidencialidad CCHIA - v1.0'
      }
    };

    setCurrentUser(profile);

    // Reclamar tarjeta si existe precargada con el mismo email
    setCards(prevCards => {
      let modified = false;
      const next = prevCards.map(c => {
        if (c.email.trim().toLowerCase() === email.trim().toLowerCase() && (!c.ownerUid || c.ownerUid.startsWith('pre-import-'))) {
          modified = true;
          return { ...c, ownerUid: profile.uid, actualizadoEn: now };
        }
        return c;
      });
      return modified ? next : prevCards;
    });

    return profile;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getUserCard = (): Card | undefined => {
    if (!currentUser) return undefined;
    return cards.find(
      c => c.ownerUid === currentUser.uid ||
           (c.email && c.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
    );
  };

  const getCardBySlug = (slug: string): Card | undefined => {
    return cards.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  };

  const saveUserCard = async (cardData: Partial<Card>): Promise<Card> => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para guardar tu tarjeta.');
    }

    const now = new Date().toISOString();
    const existing = getUserCard();

    // Generación de slug limpio
    const baseSlug = generateSlug(cardData.nombre || existing?.nombre || 'socio');
    const otherSlugs = cards
      .filter(c => c.id !== existing?.id)
      .map(c => c.slug);
    const slug = existing && existing.nombre === cardData.nombre
      ? existing.slug
      : ensureUniqueSlug(baseSlug, otherSlugs, existing?.id);

    if (existing) {
      // Regla de moderación: Si ya estaba publicada, los cambios de texto quedan publicados de inmediato,
      // pero se marcan para revisión del administrador (revisarCambios: true)
      const nextEstado: CardStatus = existing.estado === 'Publicada'
        ? 'Publicada'
        : 'En revisión';
      const revisarCambios = existing.estado === 'Publicada';

      const updatedCard: Card = {
        ...existing,
        ...cardData,
        id: existing.id,
        ownerUid: currentUser.uid,
        slug,
        estado: nextEstado,
        revisarCambios,
        actualizadoEn: now,
      } as Card;

      setCards(prev => prev.map(c => (c.id === existing.id ? updatedCard : c)));
      return updatedCard;
    } else {
      // Al guardar por primera vez, la tarjeta queda "En revisión"
      const newCard: Card = {
        id: 'card_' + Date.now(),
        ownerUid: currentUser.uid,
        slug,
        tipo: cardData.tipo || 'Empresa',
        nombre: cardData.nombre || '',
        titulo: cardData.titulo || '',
        categoria: cardData.categoria || 'IA generativa',
        descripcion: cardData.descripcion || '',
        logoUrl: cardData.logoUrl || '',
        contactoNombre: cardData.contactoNombre || '',
        email: cardData.email || currentUser.email,
        telefono: cardData.telefono || '',
        mostrarTelefono: cardData.mostrarTelefono ?? false,
        web: cardData.web || '',
        linkedin: cardData.linkedin || '',
        instagram: cardData.instagram || '',
        otroEnlace: cardData.otroEnlace || '',
        estado: 'En revisión', // Estado inicial obligatorio
        revisarCambios: false,
        creadoEn: now,
        actualizadoEn: now,
      };

      setCards(prev => [newCard, ...prev]);
      return newCard;
    }
  };

  const adminUpdateCard = async (cardId: string, updates: Partial<Card>): Promise<Card> => {
    if (currentUser?.rol !== 'admin') {
      throw new Error('Solo los administradores pueden editar cualquier tarjeta.');
    }

    const now = new Date().toISOString();
    let updated: Card | null = null;

    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        updated = {
          ...c,
          ...updates,
          actualizadoEn: now
        } as Card;
        return updated;
      }
      return c;
    }));

    if (!updated) throw new Error('Tarjeta no encontrada');
    return updated;
  };

  const updateCardStatus = async (cardId: string, newStatus: CardStatus, motivoOculto?: string): Promise<void> => {
    if (currentUser?.rol !== 'admin') {
      throw new Error('Solo los administradores pueden cambiar el estado de las tarjetas.');
    }

    const now = new Date().toISOString();
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          estado: newStatus,
          motivoOculto: newStatus === 'Oculta' ? (motivoOculto || '') : undefined,
          revisarCambios: false,
          actualizadoEn: now
        };
      }
      return c;
    }));
  };

  const deleteCard = async (cardId: string): Promise<void> => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (currentUser?.rol !== 'admin' && (card.ownerUid !== currentUser?.uid || card.estado !== 'Borrador')) {
      throw new Error('No tienes permisos para eliminar esta tarjeta.');
    }

    setCards(prev => prev.filter(c => c.id !== cardId));
  };

  const exportToCSV = (): string => {
    const headers = [
      'ID',
      'Tipo de Socio',
      'Nombre',
      'Título del Servicio',
      'Categoría',
      'Descripción',
      'Persona de Contacto',
      'Email',
      'Teléfono',
      'Mostrar Teléfono',
      'Web',
      'LinkedIn',
      'Instagram',
      'Otro Enlace',
      'Estado',
      'Slug',
      'Revisar Cambios',
      'Motivo Oculto',
      'Creado En',
      'Actualizado En'
    ];

    const rows = cards.map(c => [
      c.id,
      c.tipo,
      `"${c.nombre.replace(/"/g, '""')}"`,
      `"${c.titulo.replace(/"/g, '""')}"`,
      `"${c.categoria.replace(/"/g, '""')}"`,
      `"${c.descripcion.replace(/"/g, '""')}"`,
      `"${c.contactoNombre.replace(/"/g, '""')}"`,
      c.email,
      c.telefono || '',
      c.mostrarTelefono ? 'SÍ' : 'NO',
      c.web || '',
      c.linkedin || '',
      c.instagram || '',
      c.otroEnlace || '',
      c.estado,
      c.slug,
      c.revisarCambios ? 'SÍ' : 'NO',
      `"${(c.motivoOculto || '').replace(/"/g, '""')}"`,
      c.creadoEn,
      c.actualizadoEn
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  };

  const importFromCSV = async (csvContent: string): Promise<{ imported: number; errors: string[] }> => {
    if (currentUser?.rol !== 'admin') {
      throw new Error('Solo los administradores pueden importar tarjetas.');
    }

    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return { imported: 0, errors: ['El archivo CSV no contiene filas de datos válidas.'] };
    }

    const now = new Date().toISOString();
    const importedCards: Card[] = [];
    const errors: string[] = [];

    // Simple regex or split respecting quotes
    const parseCSVLine = (text: string): string[] => {
      const result: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"' && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(cur);
          cur = '';
        } else {
          cur += char;
        }
      }
      result.push(cur);
      return result;
    };

    const headerLine = lines[0].toLowerCase();
    const isGoogleForm = headerLine.includes('marca temporal') || headerLine.includes('timestamp');

    for (let i = 1; i < lines.length; i++) {
      try {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 5) continue;

        let tipo: any = 'Empresa';
        let nombre = '';
        let titulo = '';
        let categoria: any = 'IA generativa';
        let descripcion = '';
        let contactoNombre = '';
        let email = '';
        let telefono = '';
        let web = '';
        let linkedin = '';
        let instagram = '';
        let otroEnlace = '';

        if (isGoogleForm) {
          // Google form typically has: Timestamp, Email, Tipo, Nombre, Titulo, Categoria, Descripcion, Contacto, ...
          email = cols[1]?.trim() || '';
          tipo = cols[2]?.trim() || 'Empresa';
          nombre = cols[3]?.trim() || '';
          titulo = cols[4]?.trim() || '';
          categoria = cols[5]?.trim() || 'IA generativa';
          descripcion = cols[6]?.trim() || '';
          contactoNombre = cols[7]?.trim() || '';
          telefono = cols[8]?.trim() || '';
          web = cols[9]?.trim() || '';
          linkedin = cols[10]?.trim() || '';
        } else {
          // Direct format
          tipo = cols[1]?.trim() || 'Empresa';
          nombre = cols[2]?.trim() || '';
          titulo = cols[3]?.trim() || '';
          categoria = cols[4]?.trim() || 'IA generativa';
          descripcion = cols[5]?.trim() || '';
          contactoNombre = cols[6]?.trim() || '';
          email = cols[7]?.trim() || '';
          telefono = cols[8]?.trim() || '';
          web = cols[10]?.trim() || '';
          linkedin = cols[11]?.trim() || '';
        }

        if (!nombre || !email) {
          errors.push(`Fila ${i + 1}: Faltan campos obligatorios (nombre o email).`);
          continue;
        }

        const baseSlug = generateSlug(nombre);
        const existingSlugs = [...cards, ...importedCards].map(c => c.slug);
        const slug = ensureUniqueSlug(baseSlug, existingSlugs);

        const newCard: Card = {
          id: 'import_' + Date.now() + '_' + i,
          ownerUid: 'pre-import-' + email.toLowerCase(),
          slug,
          tipo: (tipo === 'Institución' || tipo === 'Profesional') ? tipo : 'Empresa',
          nombre: nombre.slice(0, 120),
          titulo: (titulo || 'Servicios y soluciones de Inteligencia Artificial').slice(0, 80),
          categoria: (categoria as any) || 'IA generativa',
          descripcion: (descripcion || 'Miembro de la Cámara Chilena de Inteligencia Artificial.').slice(0, 300),
          contactoNombre: contactoNombre || nombre,
          email: email.toLowerCase(),
          telefono,
          mostrarTelefono: Boolean(telefono),
          web,
          linkedin,
          instagram,
          otroEnlace,
          estado: 'Publicada', // Al precargar desde CCHIA se marcan publicadas o en revisión
          revisarCambios: false,
          creadoEn: now,
          actualizadoEn: now
        };

        importedCards.push(newCard);
      } catch (err: any) {
        errors.push(`Fila ${i + 1}: Error al procesar (${err.message}).`);
      }
    }

    if (importedCards.length > 0) {
      setCards(prev => [...importedCards, ...prev]);
    }

    return { imported: importedCards.length, errors };
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) {
      const now = new Date().toISOString();
      const mockProfile: UserProfile = {
        uid: role === 'admin' ? 'admin-cchia-uid' : 'socio-lumen-uid',
        email: role === 'admin' ? 'admin@cchia.cl' : 'contacto@lumendata.cl',
        nombre: role === 'admin' ? 'Administrador CCHIA' : 'Rodrigo Araya (Lumen Data)',
        rol: role,
        proveedor: 'google',
        aceptoPrivacidad: { fecha: now, version: 'Ley N.° 21.719 - v1.0' },
        aceptoConfidencialidad: { fecha: now, version: 'Acuerdo Confidencialidad CCHIA - v1.0' }
      };
      setCurrentUser(mockProfile);
    } else {
      setCurrentUser(prev => prev ? { ...prev, rol: role } : null);
    }
  };

  const resetToSampleData = () => {
    setCards(INITIAL_CARDS);
    localStorage.removeItem(STORAGE_CARDS_KEY);
  };

  return (
    <DirectoryContext.Provider
      value={{
        cards,
        publishedCards,
        currentUser,
        loading,
        login,
        logout,
        saveUserCard,
        adminUpdateCard,
        updateCardStatus,
        deleteCard,
        getUserCard,
        getCardBySlug,
        exportToCSV,
        importFromCSV,
        switchRole,
        resetToSampleData
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error('useDirectory debe usarse dentro de un DirectoryProvider');
  }
  return context;
};
