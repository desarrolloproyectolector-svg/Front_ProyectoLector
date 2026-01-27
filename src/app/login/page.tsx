'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginBook } from '../../components/LoginBook';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const handleBookOpened = () => {
            // The book animation takes about 4.5s to trigger this event
            // At this point, the book is dissolved/zoomed. 
            // We wait a tiny fraction to ensure avoiding any "blink" before pushing the new route.
            setTimeout(() => {
                // Default redirection to alumno for now
                router.push('/alumno/store');
            }, 100);
        };

        document.addEventListener('bookOpened', handleBookOpened);

        return () => {
            document.removeEventListener('bookOpened', handleBookOpened);
        };
    }, [router]);

    return <LoginBook />;
}
