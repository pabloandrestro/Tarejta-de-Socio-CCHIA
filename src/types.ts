export type MemberType = 'Empresa' | 'Institución' | 'Profesional';

export type Category =
  | 'IA generativa'
  | 'Analítica y datos'
  | 'Visión computacional'
  | 'Automatización'
  | 'Gobernanza y ética'
  | 'Formación'
  | 'Consultoría'
  | 'Infraestructura y hardware'
  | 'Otra';

export const CATEGORIES: Category[] = [
  'IA generativa',
  'Analítica y datos',
  'Visión computacional',
  'Automatización',
  'Gobernanza y ética',
  'Formación',
  'Consultoría',
  'Infraestructura y hardware',
  'Otra'
];

export const MEMBER_TYPES: MemberType[] = ['Empresa', 'Institución', 'Profesional'];

export type CardStatus = 'Borrador' | 'En revisión' | 'Publicada' | 'Oculta';

export interface Card {
  id: string;
  ownerUid: string;
  slug: string;
  tipo: MemberType;
  nombre: string;
  titulo: string; // máx 80 caracteres
  categoria: Category;
  descripcion: string; // máx 300 caracteres
  logoUrl?: string;
  contactoNombre: string;
  email: string;
  telefono?: string;
  mostrarTelefono: boolean;
  web?: string;
  linkedin?: string;
  instagram?: string;
  otroEnlace?: string;
  estado: CardStatus;
  revisarCambios?: boolean;
  motivoOculto?: string;
  esEjemplo?: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export type UserRole = 'socio' | 'admin';

export interface LegalConsent {
  fecha: string;
  version: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  nombre: string;
  rol: UserRole;
  fotoUrl?: string;
  proveedor?: 'google' | 'linkedin';
  aceptoPrivacidad?: LegalConsent;
  aceptoConfidencialidad?: LegalConsent;
}

export interface CopySuggestion {
  titulo: string;
  descripcion: string;
  explicacion: string;
}
