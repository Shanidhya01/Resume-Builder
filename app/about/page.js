'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaUsers } from 'react-icons/fa';
import { IoIosRocket, IoMdCheckmarkCircle } from 'react-icons/io';
import { HiSparkles } from 'react-icons/hi';
import { SiNextdotjs, SiReact, SiTailwindcss, SiRedux } from 'react-icons/si';
import { Code2 } from 'lucide-react';
import Card from '@/components/UI/Card';
import Badge from '@/components/UI/Badge';
import Spinner from '@/components/UI/Spinner';

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5 },
};

const AboutPage = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch contributors from GitHub API
    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await fetch('https://api.github.com/repos/Shanidhya01/Resume-Builder/contributors');
                const data = await response.json();
                setContributors(data.slice(0, 12)); // Get top 12 contributors
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contributors:', error);
                setLoading(false);
            }
        };
        fetchContributors();
    }, []);

    const adminInfo = {
        name: 'Shanidhya Kumar',
        role: 'Full-Stack Developer',
        bio: '3rd year B.E. in Computer Science & Engineering (IoT & Cyber Security) based in Bangalore, India. Passionate full-stack developer and AI/ML enthusiast with strong DSA foundations in C++. Building modern web applications with React, Next.js, TypeScript, Node.js, and MongoDB. Actively shipping projects and exploring AI assistants and real-time applications.',
        avatar: 'https://avatars.githubusercontent.com/u/152613465?v=4',
        socials: {
            github: 'https://github.com/Shanidhya01',
            linkedin: 'https://www.linkedin.com/in/shanidhya-kumar/',
            email: 'luckykumar0011s@gmail.com',
        },
    };

    const features = [
        { icon: IoIosRocket, title: 'Lightning fast', description: 'Built with Next.js for optimal performance and instant page loads.' },
        { icon: HiSparkles, title: 'Beautiful UI', description: 'A modern, premium design system with smooth, purposeful motion.' },
        { icon: IoMdCheckmarkCircle, title: 'ATS-friendly', description: 'Resume formats optimized to pass Applicant Tracking Systems.' },
        { icon: Code2, title: 'Open source', description: '100% free and open source — contribute and customize as you need.' },
    ];

    const techStack = [
        { name: 'Next.js', icon: SiNextdotjs },
        { name: 'React', icon: SiReact },
        { name: 'Tailwind CSS', icon: SiTailwindcss },
        { name: 'Redux Toolkit', icon: SiRedux },
    ];

    return (
        <div className="relative overflow-hidden">
            {/* Ambient accent glow + grid */}
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
                {/* Header */}
                <motion.div {...reveal} className="mb-20 text-center">
                    <Badge tone="accent" size="md" className="mb-5">
                        <HiSparkles className="h-3.5 w-3.5" /> About HireReady
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl lg:text-6xl">
                        Building the future of <span className="text-accent">resume creation</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
                        A modern, free, and open-source resume builder designed to help job seekers
                        create professional, ATS-friendly resumes in minutes.
                    </p>
                </motion.div>

                {/* Creator */}
                <motion.div {...reveal} className="mb-20">
                    <Card variant="elevated" className="overflow-hidden">
                        <div className="flex flex-col items-center gap-8 lg:flex-row">
                            <div className="relative shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full opacity-40 blur-2xl"
                                    style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }}
                                    aria-hidden="true"
                                />
                                {/* Remote GitHub avatar — plain img avoids next.config host whitelisting. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={adminInfo.avatar}
                                    alt={adminInfo.name}
                                    className="relative h-36 w-36 rounded-full border border-line object-cover shadow-ds-lg"
                                />
                            </div>
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className="text-2xl font-bold text-fg">{adminInfo.name}</h2>
                                <p className="mt-1 font-semibold text-accent">{adminInfo.role}</p>
                                <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">{adminInfo.bio}</p>
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                    <a href={adminInfo.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-3">
                                        <FaGithub className="h-4 w-4" /> GitHub
                                    </a>
                                    <a href={adminInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-3">
                                        <FaLinkedin className="h-4 w-4 text-[#0a66c2]" /> LinkedIn
                                    </a>
                                    <a href={`mailto:${adminInfo.socials.email}`} className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-3">
                                        <FaEnvelope className="h-4 w-4 text-accent" /> Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Project description */}
                <motion.div {...reveal} className="mb-20">
                    <h2 className="mb-6 text-center text-3xl font-bold text-fg">About the project</h2>
                    <Card variant="elevated">
                        <p className="text-lg leading-relaxed text-fg-muted">
                            <strong className="text-fg">HireReady</strong> is a powerful, completely free
                            resume builder designed to help job seekers create professional, ATS-friendly
                            resumes without any hassle. Built with modern web technologies, it offers a
                            seamless experience from creation to download.
                        </p>
                        <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                            No hidden fees, no watermarks — just beautiful resumes ready for download in PDF
                            format. The tool is designed with simplicity and effectiveness in mind, making
                            professional resume creation accessible to everyone.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            <Badge tone="info" size="md">Free forever</Badge>
                            <Badge tone="accent" size="md">Open source</Badge>
                            <Badge tone="success" size="md">Cloud sync</Badge>
                            <Badge tone="warning" size="md">ATS-optimized</Badge>
                        </div>
                    </Card>
                </motion.div>

                {/* Features */}
                <motion.div {...reveal} className="mb-20">
                    <h2 className="mb-10 text-center text-3xl font-bold text-fg">Key features</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map(feature => (
                            <Card key={feature.title} variant="interactive">
                                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                                    <feature.icon className="h-6 w-6" />
                                </span>
                                <h3 className="text-lg font-semibold text-fg">{feature.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Tech stack */}
                <motion.div {...reveal} className="mb-20">
                    <h2 className="mb-10 text-center text-3xl font-bold text-fg">Built with modern tech</h2>
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                        {techStack.map(tech => (
                            <Card key={tech.name} variant="interactive" className="flex flex-col items-center gap-3 py-8">
                                <tech.icon className="h-11 w-11 text-fg" />
                                <span className="font-semibold text-fg">{tech.name}</span>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Contributors */}
                <motion.div {...reveal}>
                    <h2 className="mb-3 flex items-center justify-center gap-3 text-center text-3xl font-bold text-fg">
                        <FaUsers className="h-7 w-7 text-accent" /> Contributors
                    </h2>
                    <p className="mb-10 text-center text-fg-muted">
                        Special thanks to everyone who has contributed to this project.
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : contributors.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {contributors.map(contributor => (
                                <a
                                    key={contributor.id ?? contributor.login}
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-ds-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-ds-md"
                                >
                                    {/* Remote GitHub avatar — see note above. */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={contributor.avatar_url}
                                        alt={contributor.login}
                                        className="h-16 w-16 rounded-full border border-line object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="text-center">
                                        <p className="w-full truncate text-sm font-semibold text-fg">{contributor.login}</p>
                                        <p className="text-xs text-fg-subtle">{contributor.contributions} commits</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center">
                            <p className="text-fg-muted">
                                Want to be the first contributor? Check out our{' '}
                                <a href="https://github.com/Shanidhya01/Resume-Builder" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                                    GitHub repository
                                </a>
                                !
                            </p>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
