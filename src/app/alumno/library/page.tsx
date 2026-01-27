'use client';

import React, { useState } from 'react';
import { ContinuarLectura } from '../../../components/ContinuarLectura';
import { TarjetaLibro } from '../../../components/TarjetaLibro';
import { DetalleProducto } from '../../../components/DetalleProducto';
import { libros } from '../../../data/libros';
import type { Libro } from '../../../data/libros';

export default function LibraryPage() {
    const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
    const ownedBooks = libros.filter(b => b.progress > 0 || b.owned);

    return (
        <div>
            {/* Hero */}
            <section className="mb-8 md:mb-12">
                <ContinuarLectura />
            </section>

            {/* Books */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-playfair text-xl md:text-2xl font-bold text-[#2b1b17]">Tu Biblioteca</h2>
                    <span className="bg-[#2b1b17] text-[#d4af37] px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase shadow-md flex items-center gap-2 transition-transform hover:scale-105">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        {ownedBooks.length} {ownedBooks.length === 1 ? 'Libro' : 'Libros'}
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                    {ownedBooks.map(libro => (
                        <TarjetaLibro
                            key={libro.id}
                            {...libro}
                            onClick={() => setSelectedBook(libro)}
                        />
                    ))}
                </div>
            </section>

            {/* Product Detail Overlay */}
            <DetalleProducto
                libro={selectedBook}
                isOpen={!!selectedBook}
                onClose={() => setSelectedBook(null)}
            />
        </div>
    );
}
