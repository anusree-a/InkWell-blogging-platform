'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with pen icon */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>Inkwell</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8">
            <Link 
              href="/" 
              className={`font-medium transition-all ${
                pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/posts" 
              className={`font-medium transition-all ${
                pathname === '/posts' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Explore
            </Link>
            <Link 
              href="/categories" 
              className={`font-medium transition-all ${
                pathname === '/categories'
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/dashboard" 
              className={`bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm ${
                pathname?.startsWith('/dashboard') ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              Write
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-in slide-in-from-top">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg transition ${
                pathname === '/' 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/posts" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg transition ${
                pathname === '/posts' 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Explore
            </Link>
            <Link 
              href="/categories" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg transition ${
                pathname === '/categories'
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-center ${
                pathname?.startsWith('/dashboard') ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              Write
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}