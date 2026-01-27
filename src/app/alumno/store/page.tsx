'use client';

import React, { useState } from 'react';
import Tienda from '../../../components/Tienda';
import { DetalleProducto } from '../../../components/DetalleProducto';
import type { Libro } from '../../../data/libros';

export default function StorePage() {
    const [selectedBook, setSelectedBook] = useState<Libro | null>(null);

    return (
        <>
            <Tienda onSelectBook={setSelectedBook} />
            {/* Product Detail Overlay */}
            <DetalleProducto
                libro={selectedBook}
                isOpen={!!selectedBook}
                onClose={() => setSelectedBook(null)}
            />
        </>
    );
}
