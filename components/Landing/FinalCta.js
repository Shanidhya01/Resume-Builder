'use client';

import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import Button from '@/components/UI/Button';
import { Reveal } from './shared';

export default function FinalCta() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <Reveal>
                <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center shadow-ds-lg sm:px-12 sm:py-20">
                    {/* Decorative accent */}
                    <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden="true" />
                    <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/25 blur-[100px]" aria-hidden="true" />

                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl">
                            Build a resume that gets interviews.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-fg-muted sm:text-lg">
                            Join thousands of job seekers landing more callbacks with AI-optimized, ATS-ready resumes — free.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button as={Link} href="/register" variant="primary" size="xl" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                Start Building
                            </Button>
                            <Button
                                as="a"
                                href="https://github.com/Shanidhya01/Resume-Builder"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="outline"
                                size="xl"
                                leftIcon={<Github className="h-4 w-4" />}
                            >
                                GitHub Repository
                            </Button>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
