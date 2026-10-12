import React, { useState } from 'react';
import { useSEO } from '../utils/seo';
import {
  Code,
  Copy,
  Check,
  Server,
  Key,
  Shield,
  Globe,
  Database,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export const FirebaseSetupPage: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useSEO({
    title: 'Guía de Configuración Firebase y Despliegue | Directorio CCHIA',
    description: 'Instrucciones paso a paso para configurar el proyecto en Firebase (Auth, Firestore, Storage, LinkedIn OIDC) y desplegar en dominio propio.',
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(id);
      setTimeout(() => setCopiedSection(null), 2500);
    });
  };

  const firestoreRulesSnippet = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }

    function isSignedIn() { return request.auth != null; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
    function isAdmin() {
      return isSignedIn() && (
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rol == 'admin'
      );
    }

    match /users/{uid} {
      allow get: if isOwner(uid) || isAdmin();
      allow list: if isAdmin();
      allow create: if isOwner(uid);
      allow update: if isOwner(uid) || isAdmin();
    }

    match /cards/{cardId} {
      allow get: if resource.data.estado == 'Publicada' ||
                    (isSignedIn() && resource.data.ownerUid == request.auth.uid) ||
                    isAdmin();
      allow list: if resource.data.estado == 'Publicada' ||
                     (isSignedIn() && resource.data.ownerUid == request.auth.uid) ||
                     isAdmin();
      allow create: if isSignedIn() && request.resource.data.ownerUid == request.auth.uid;
      allow update: if isAdmin() || (
        isSignedIn() && resource.data.ownerUid == request.auth.uid &&
        request.resource.data.ownerUid == resource.data.ownerUid
      );
      allow delete: if isAdmin() || (isSignedIn() && resource.data.ownerUid == request.auth.uid && resource.data.estado == 'Borrador');
    }
  }
}`;

  const storageRulesSnippet = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /logos/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|webp)');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 shadow-xs">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF8FA] text-[#157A86] border border-[#BDE7EC] mb-3">
          <Server className="w-3.5 h-3.5 mr-1.5" />
          Guía de Infraestructura y Despliegue
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#15385F] tracking-tight">
          Cómo Configurar Firebase y Publicar con Dominio Propio
        </h1>

        <p className="mt-2 text-sm sm:text-base text-[#15385F]/80 leading-relaxed">
          Esta aplicación full-stack está completamente estructurada para conectarse a tu proyecto oficial de Firebase y Cloud Run con dominio personalizado (ej. <code>directorio.cchia.cl</code>).
        </p>
      </div>

      {/* Paso 1: Proyecto Firebase & Authentication */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#15385F] text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-lg font-heading font-bold text-[#15385F]">
            Proyecto Firebase y Proveedores de Autenticación
          </h2>
        </div>

        <div className="space-y-3 text-sm text-[#15385F]/90 leading-relaxed pl-11">
          <p>
            1. Accede a <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#1C92A0] underline font-semibold">Firebase Console</a> y crea un nuevo proyecto llamado <strong>cchia-directorio</strong>.
          </p>
          <p>
            2. En el menú lateral, dirígete a <strong>Authentication &gt; Sign-in method</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Google:</strong> Habilita el proveedor nativo. Solo requiere indicar el correo de asistencia y guardar.
            </li>
            <li>
              <strong>LinkedIn (OIDC):</strong> En la pestaña <em>Sign-in method</em>, haz clic en <em>Agregar nuevo proveedor</em> y selecciona <strong>OpenID Connect (OIDC)</strong>.
              <ul className="list-circle pl-5 mt-1 space-y-1 text-xs text-[#64748B]">
                <li>Nombre del proveedor: <code>LinkedIn</code></li>
                <li>ID del cliente y Secreto: Obténlos desde <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noreferrer" className="underline text-[#1C92A0]">LinkedIn Developer Portal</a> con el producto «Sign In with LinkedIn using OpenID Connect».</li>
                <li>Emisor (Issuer URL): <code>https://www.linkedin.com/oauth</code></li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* Paso 2: Firestore & Reglas */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#15385F] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h2 className="text-lg font-heading font-bold text-[#15385F]">
              Firestore Database y Reglas de Seguridad
            </h2>
          </div>

          <button
            onClick={() => copyToClipboard(firestoreRulesSnippet, 'firestore')}
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#15385F] hover:bg-[#F7F9FB]"
          >
            {copiedSection === 'firestore' ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-[#1C92A0]" />
                Copiar firestore.rules
              </>
            )}
          </button>
        </div>

        <div className="pl-11 space-y-3 text-sm text-[#15385F]/90">
          <p>
            Crea la base de datos en modo producción (región <code>southamerica-west1</code> Santiago o <code>us-east1</code>).
            En la pestaña <strong>Reglas</strong>, pega el contenido generado en el archivo <code>firestore.rules</code>:
          </p>

          <pre className="p-4 rounded-xl bg-[#0E2540] text-white text-xs font-mono overflow-x-auto">
            {firestoreRulesSnippet}
          </pre>
        </div>
      </section>

      {/* Paso 3: Firebase Storage (Logos) */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#15385F] text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h2 className="text-lg font-heading font-bold text-[#15385F]">
              Firebase Storage (Subida de Logos hasta 5MB)
            </h2>
          </div>

          <button
            onClick={() => copyToClipboard(storageRulesSnippet, 'storage')}
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#15385F] hover:bg-[#F7F9FB]"
          >
            {copiedSection === 'storage' ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-[#1C92A0]" />
                Copiar storage.rules
              </>
            )}
          </button>
        </div>

        <div className="pl-11 space-y-3 text-sm text-[#15385F]/90">
          <p>
            En Firebase Storage, activa el bucket e inserta estas reglas que validan que el logo no supere los 5 MB y sea formato JPG, PNG o WebP:
          </p>

          <pre className="p-4 rounded-xl bg-[#0E2540] text-white text-xs font-mono overflow-x-auto">
            {storageRulesSnippet}
          </pre>
        </div>
      </section>

      {/* Paso 4: Despliegue con Dominio Propio */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#15385F] text-white flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h2 className="text-lg font-heading font-bold text-[#15385F]">
            Publicación con Dominio Propio (ej. directorio.cchia.cl)
          </h2>
        </div>

        <div className="pl-11 space-y-4 text-sm text-[#15385F]/90 leading-relaxed">
          <p>
            Para publicar la aplicación con SSL automático y tu propio subdominio:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F7F9FB] border border-[#E2E8F0]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#15385F] mb-1">
                Opción A: Firebase Hosting + Cloud Run
              </h3>
              <p className="text-xs text-[#64748B] mb-3">
                Conecta Firebase Hosting con el contenedor Node.js / Express en Cloud Run.
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-xs">
                <li>En Firebase Console, entra a <strong>Hosting &gt; Agregar dominio personalizado</strong>.</li>
                <li>Escribe <code>directorio.cchia.cl</code>.</li>
                <li>Agrega el registro <code>CNAME</code> o <code>A</code> provisto en el DNS de tu dominio en NIC Chile o Cloudflare.</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9FB] border border-[#E2E8F0]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#15385F] mb-1">
                Opción B: Cloud Run Domain Mapping Directo
              </h3>
              <p className="text-xs text-[#64748B] mb-3">
                Mapea el servicio de Google Cloud Run directamente con certificado gestionado por Google.
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-xs">
                <li>En Google Cloud Console &gt; Cloud Run &gt; Administrar dominios personalizados.</li>
                <li>Agrega la asignación a <code>directorio.cchia.cl</code>.</li>
                <li>Google aprovisionará automáticamente el certificado SSL Let's Encrypt / Google Trust Services en minutos.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Prerendering / SSR Explanation (Requirement 2) */}
      <section className="bg-[#EBF8FA] rounded-2xl border border-[#BDE7EC] p-6 sm:p-8 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#157A86] flex items-center">
          <Globe className="w-4 h-4 mr-1.5" />
          Indexación en Buscadores (SSR y Prerendering)
        </h3>
        <p className="text-xs sm:text-sm text-[#15385F] leading-relaxed">
          <strong>Estado actual:</strong> La aplicación incluye inyección dinámica de meta tags (title, description, OpenGraph, Twitter Cards, canonical link) y datos estructurados JSON-LD Schema.org (Organization / Person) ejecutados al renderizar en el cliente. Además, el servidor Express genera dinámicamente <code>/sitemap.xml</code> con todas las tarjetas publicadas y <code>/robots.txt</code> bloqueando <code>/mi-tarjeta</code> y <code>/admin</code>.
        </p>
        <p className="text-xs sm:text-sm text-[#15385F] leading-relaxed">
          <strong>Para prerenderizado estático completo (SSG / SSR puro):</strong> Googlebot procesa JavaScript moderno en SPAs, pero si requieres HTML pre-compilado para crawlers más antiguos de redes sociales (como bots de WhatsApp o LinkedIn sin renderizador JS completo), solo se requiere habilitar un middleware de prerenderizado en <code>server.ts</code> (como <code>prerender-node</code> o Next.js export).
        </p>
      </section>
    </div>
  );
};
