'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FileText, FilePlus2, LayoutDashboard, LayoutTemplate, Settings,
    User, LogOut, Github, Search, Menu, X, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';
import ThemeToggle from '@/components/UI/ThemeToggle';
import Avatar from '@/components/UI/Avatar';
import Button from '@/components/UI/Button';
import Kbd from '@/components/UI/Kbd';
import CommandPalette, { openCommandPalette } from '@/components/UI/CommandPalette';

const AUTHED_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard?create=true', label: 'New Resume', icon: FilePlus2 },
    { href: '/templates', label: 'Templates', icon: LayoutTemplate },
];

const GUEST_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { href: '/about', label: 'About' },
];

const isActivePath = (pathname, href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`);

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const closeMenus = () => {
        setMobileOpen(false);
        setMenuOpen(false);
    };

    // Click-outside + Escape for the profile menu.
    useEffect(() => {
        if (!menuOpen) return;
        const onClick = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

    const handleLogout = async () => {
        await logOut();
        setMenuOpen(false);
        setMobileOpen(false);
        router.push('/');
    };

    // Public resume pages are a standalone shareable surface with no chrome.
    if (pathname?.startsWith('/r/')) return null;

    const links = user ? AUTHED_LINKS : GUEST_LINKS;

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                    {/* Logo */}
                    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-ds-sm transition-transform group-hover:scale-105">
                            <FileText className="h-4 w-4" strokeWidth={2.4} />
                        </span>
                        <span className="text-[15px] font-semibold tracking-tight text-fg">HireReady</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-0.5 md:flex">
                        {links.map(link => {
                            const active = isActivePath(pathname, link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenus}
                                    className={cn(
                                        'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        active ? 'text-fg' : 'text-fg-muted hover:text-fg',
                                    )}
                                >
                                    {link.label}
                                    {active && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute inset-0 -z-10 rounded-lg bg-surface-2"
                                            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right cluster */}
                    <div className="flex items-center gap-1.5">
                        {/* Command palette trigger (desktop) */}
                        <button
                            onClick={openCommandPalette}
                            className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs text-fg-subtle transition-colors hover:border-line-strong hover:text-fg-muted lg:flex"
                            aria-label="Open command palette"
                        >
                            <Search className="h-3.5 w-3.5" />
                            <span>Search…</span>
                            <span className="flex items-center gap-0.5">
                                <Kbd>⌘</Kbd>
                                <Kbd>K</Kbd>
                            </span>
                        </button>

                        <a
                            href="https://github.com/Shanidhya01/Resume-Builder"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View source on GitHub"
                            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
                        >
                            <Github className="h-4 w-4" />
                        </a>

                        <ThemeToggle />

                        {!loading && user ? (
                            <div ref={menuRef} className="relative hidden md:block">
                                <button
                                    onClick={() => setMenuOpen(o => !o)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    className="flex items-center gap-1.5 rounded-xl border border-transparent p-0.5 pr-1.5 transition-colors hover:bg-surface-2"
                                >
                                    <Avatar src={user.photoURL} name={user.displayName} email={user.email} size="sm" />
                                    <ChevronDown className={cn('h-3.5 w-3.5 text-fg-muted transition-transform', menuOpen && 'rotate-180')} />
                                </button>
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            role="menu"
                                            initial={{ opacity: 0, scale: 0.96, y: -6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98, y: -4 }}
                                            transition={{ duration: 0.14 }}
                                            className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-ds-xl"
                                        >
                                            <div className="flex items-center gap-3 px-2.5 py-2">
                                                <Avatar src={user.photoURL} name={user.displayName} email={user.email} size="md" />
                                                <div className="min-w-0">
                                                    {user.displayName && <p className="truncate text-sm font-semibold text-fg">{user.displayName}</p>}
                                                    <p className="truncate text-xs text-fg-muted">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="my-1.5 h-px bg-line" />
                                            {[
                                                { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                                                { href: '/account', label: 'Account', icon: User },
                                            ].map(item => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    role="menuitem"
                                                    onClick={closeMenus}
                                                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <div className="my-1.5 h-px bg-line" />
                                            <button
                                                onClick={handleLogout}
                                                role="menuitem"
                                                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            !loading && (
                                <div className="hidden items-center gap-1.5 md:flex">
                                    <Button as={Link} href="/login" variant="ghost" size="sm">
                                        Log in
                                    </Button>
                                    <Button as={Link} href="/register" variant="primary" size="sm">
                                        Get started
                                    </Button>
                                </div>
                            )
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-line bg-canvas md:hidden"
                        >
                            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
                                {links.map(link => {
                                    const active = isActivePath(pathname, link.href);
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={closeMenus}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                                active ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                                            )}
                                        >
                                            {Icon && <Icon className="h-4 w-4" />}
                                            {link.label}
                                        </Link>
                                    );
                                })}
                                <div className="my-1.5 h-px bg-line" />
                                {!loading && user ? (
                                    <>
                                        <Link href="/dashboard/settings" onClick={closeMenus} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                                            <Settings className="h-4 w-4" /> Settings
                                        </Link>
                                        <Link href="/account" onClick={closeMenus} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                                            <User className="h-4 w-4" /> Account
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10">
                                            <LogOut className="h-4 w-4" /> Log out
                                        </button>
                                    </>
                                ) : (
                                    !loading && (
                                        <div className="flex flex-col gap-2 pt-1">
                                            <Button as={Link} href="/login" variant="outline" size="md" fullWidth>Log in</Button>
                                            <Button as={Link} href="/register" variant="primary" size="md" fullWidth>Get started</Button>
                                        </div>
                                    )
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <CommandPalette authed={!!user} />
        </>
    );
};

export default Header;
