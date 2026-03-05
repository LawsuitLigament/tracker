import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Dashboard', to: '/', icon: Home },
        { name: 'Semesters', to: '/semesters', icon: BookOpen },
        { name: 'Holidays', to: '/holidays', icon: Calendar },
        { name: 'Settings', to: '/settings', icon: SettingsIcon },
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const currentLinkName = links.find(l => isActive(l.to))?.name || 'track';

    useEffect(() => {
        document.title = currentLinkName === 'track'
            ? 'track'
            : `${currentLinkName} | track`;
    }, [currentLinkName]);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-20">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{currentLinkName}</h1>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-muted-foreground hover:text-foreground">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav
                className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-card md:bg-transparent border-r border-border transition-transform duration-200 ease-in-out z-10 flex flex-col p-4 space-y-2`}
            >
                <div className="hidden md:block mb-8 px-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{currentLinkName}</h1>
                </div>

                <div className="flex-1 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${isActive(link.to)
                                    ? 'bg-primary/20 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto px-2 py-4">
                    <p className="text-xs text-muted-foreground text-center">Stay on track.</p>
                </div>
            </nav>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
