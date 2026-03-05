import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans antialiased">
            <Navigation />
            <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#44475a',
                        color: '#f8f8f2',
                        border: '1px solid #6272a4',
                    },
                }}
            />
        </div>
    );
}
