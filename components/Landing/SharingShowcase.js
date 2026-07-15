'use client';

import { motion } from 'framer-motion';
import { Share2, Eye, Download, QrCode, Globe } from 'lucide-react';
import { Counter, Section, Reveal, Eyebrow } from './shared';

const BARS = [40, 62, 48, 78, 90, 70, 96];

export default function SharingShowcase() {
    return (
        <Section id="sharing">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                    <Reveal><Eyebrow icon={Share2}>Public sharing</Eyebrow></Reveal>
                    <Reveal delay={0.05}><h2 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">One link. Always up to date. Fully tracked.</h2></Reveal>
                    <Reveal delay={0.1}><p className="mt-4 text-base leading-relaxed text-fg-muted">Publish a fast, SEO-friendly public resume with its own QR code. See who viewed and downloaded it, in real time.</p></Reveal>

                    <Reveal delay={0.15}>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {[
                                { icon: Eye, value: 1204, label: 'Views' },
                                { icon: Download, value: 318, label: 'Downloads' },
                            ].map(s => (
                                <div key={s.label} className="rounded-2xl border border-line bg-surface p-4 shadow-ds-sm">
                                    <s.icon className="h-5 w-5 text-accent" />
                                    <p className="mt-2 text-2xl font-bold text-fg"><Counter value={s.value} /></p>
                                    <p className="text-xs text-fg-muted">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.1}>
                    <div className="rounded-3xl border border-line bg-surface p-6 shadow-ds-lg">
                        {/* Public page header */}
                        <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3 py-2">
                            <span className="flex items-center gap-1.5 text-xs text-fg-muted"><Globe className="h-3.5 w-3.5 text-accent" /> hireready.app/r/alex-morgan</span>
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>

                        <div className="mt-5 flex gap-5">
                            {/* Mini analytics chart */}
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-fg-muted">Views · last 7 days</p>
                                <div className="mt-3 flex h-28 items-end gap-2">
                                    {BARS.map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                                            className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent"
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* QR */}
                            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 p-3">
                                <QrCode className="h-16 w-16 text-fg" />
                                <span className="text-[10px] text-fg-muted">Scan to view</span>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </Section>
    );
}
