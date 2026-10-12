import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDirectory } from '../context/DirectoryContext';
import {
  ShieldCheck,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  BookOpen,
  HelpCircle,
  Building2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, switchRole } = useDirectory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/directorio');
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar with quick tester for roles & dev convenience */}
      <div className="bg-[#15385F] text-xs text-white/90 py-1 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1C92A0]"></span>
          <span className="font-medium">Directorio Oficial 2026</span>
          <span className="hidden sm:inline text-white/60">• 132 socios activos en Chile</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-white/70 hidden md:inline">Modo de prueba:</span>
          <div className="inline-flex rounded-sm bg-[#0E2540] p-0.5 border border-white/20">
            <button
              onClick={() => switchRole('socio')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentUser?.rol === 'socio'
                  ? 'bg-[#1C92A0] text-white'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Simular vista y permisos de socio"
            >
              Socio
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentUser?.rol === 'admin'
                  ? 'bg-[#157A86] text-white'
                  : 'text-white/80 hover:text-white'
              }`}
              title="Simular vista y permisos de administrador"
            >
              Admin CCHIA
            </button>
          </div>
          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white flex items-center ml-2"
              title="Cerrar sesión"
            >
              <LogOut className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo CCHIA */}
          <div className="flex items-center space-x-3">
            <Link to="/directorio" className="flex items-center space-x-3 group">
              {/* Espacio reservado para el logo oficial de la CCHIA */}
              <div className="w-10 h-10 rounded-lg bg-[#15385F] text-[#1C92A0] flex items-center justify-center font-bold text-lg border-2 border-[#1C92A0] shadow-xs group-hover:scale-105 transition-transform">
                <span className="tracking-tighter font-extrabold text-white text-base">
                  CC<span className="text-[#1C92A0]">IA</span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-[#15385F] tracking-tight leading-none font-heading">
                  CCHIA
                </span>
                <span className="text-xs font-semibold text-[#157A86] tracking-normal leading-tight mt-0.5">
                  Directorio de Socios
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/directorio"
              className="text-[#15385F] hover:text-[#1C92A0] font-medium text-sm transition"
            >
              Directorio
            </Link>
            <Link
              to="/privacidad"
              className="text-[#15385F]/75 hover:text-[#15385F] text-sm transition"
            >
              Ley 21.719
            </Link>
            <Link
              to="/configuracion-firebase"
              className="text-[#15385F]/75 hover:text-[#15385F] text-sm flex items-center transition"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-[#1C92A0]" />
              Guía Firebase
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-[#E2E8F0]">
                {currentUser.rol === 'admin' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#1C92A0]" />
                    Panel Admin
                  </Link>
                ) : null}

                <Link
                  to="/mi-tarjeta"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-[#1C92A0] text-white hover:bg-[#157A86] transition shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Mi Tarjeta
                </Link>

                <div className="flex items-center space-x-2 text-xs text-[#15385F] bg-[#F7F9FB] px-2.5 py-1.5 rounded border border-[#E2E8F0]">
                  <User className="w-3.5 h-3.5 text-[#157A86]" />
                  <span className="font-medium truncate max-w-[120px]">{currentUser.nombre}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-[#E2E8F0]">
                <Link
                  to="/ingresar"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-[#15385F] text-white hover:bg-[#0E2540] transition shadow-xs"
                >
                  <User className="w-4 h-4 mr-1.5 text-[#1C92A0]" />
                  Ingresar como Socio
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#15385F] hover:bg-[#F7F9FB] focus:outline-hidden"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/directorio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#15385F] hover:bg-[#F7F9FB]"
          >
            Directorio de Socios
          </Link>
          <Link
            to="/privacidad"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#15385F]/80 hover:bg-[#F7F9FB]"
          >
            Política de Privacidad (Ley 21.719)
          </Link>
          <Link
            to="/confidencialidad"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#15385F]/80 hover:bg-[#F7F9FB]"
          >
            Acuerdo de Confidencialidad CCHIA
          </Link>
          <Link
            to="/configuracion-firebase"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-[#15385F]/80 hover:bg-[#F7F9FB]"
          >
            Guía de Configuración Firebase
          </Link>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            {currentUser ? (
              <>
                <Link
                  to="/mi-tarjeta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-md font-semibold bg-[#1C92A0] text-white"
                >
                  Mi Tarjeta
                </Link>
                {currentUser.rol === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-md font-semibold bg-[#15385F] text-white"
                  >
                    Panel de Administración
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 text-sm text-[#64748B] hover:text-red-600"
                >
                  Cerrar sesión ({currentUser.email})
                </button>
              </>
            ) : (
              <Link
                to="/ingresar"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-md font-semibold bg-[#15385F] text-white"
              >
                Ingresar como Socio
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
