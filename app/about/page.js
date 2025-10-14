'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaGlobe, FaHeart, FaStar, FaCode, FaUsers } from 'react-icons/fa';
import { IoIosRocket, IoMdCheckmarkCircle } from 'react-icons/io';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { SiNextdotjs, SiReact, SiTailwindcss, SiRedux } from 'react-icons/si';

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

    // Admin/Creator Information
    const adminInfo = {
        name: "Shanidhya Kumar",
        role: "Full-Stack Developer & Creator",
        bio: "3rd year B.E. in Computer Science & Engineering (IoT & Cyber Security) based in Bangalore, India. Passionate full-stack developer and AI/ML enthusiast with strong DSA foundations in C++. Building modern web applications with React, Next.js, TypeScript, Node.js, and MongoDB. Actively shipping projects and exploring AI assistants and real-time applications.",
        avatar: "https://avatars.githubusercontent.com/u/152613465?v=4",
        socials: {
            github: "https://github.com/Shanidhya01",
            linkedin: "https://www.linkedin.com/in/shanidhya-kumar/",
            twitter: null,
            email: "luckykumar0011s@gmail.com",
            website: null
        }
    };

    // Project Features
    const features = [
        {
            icon: IoIosRocket,
            title: "Lightning Fast",
            description: "Built with Next.js 14 for optimal performance and instant page loads"
        },
        {
            icon: HiSparkles,
            title: "Beautiful UI",
            description: "Modern, gradient-rich design with smooth animations and transitions"
        },
        {
            icon: IoMdCheckmarkCircle,
            title: "ATS-Friendly",
            description: "Resume formats optimized to pass Applicant Tracking Systems"
        },
        {
            icon: FaCode,
            title: "Open Source",
            description: "100% free and open source - contribute and customize as you need"
        }
    ];

    // Tech Stack
    const techStack = [
        { name: "Next.js 14", icon: SiNextdotjs, color: "text-white" },
        { name: "React 18", icon: SiReact, color: "text-blue-400" },
        { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-400" },
        { name: "Redux Toolkit", icon: SiRedux, color: "text-purple-400" }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
                
                {/* Header Section */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90 mb-6">
                        <HiSparkles className="w-4 h-4 text-yellow-400" />
                        <span>About HireReady</span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Building the Future
                        </span>
                        <br />
                        <span className="text-white">of Resume Creation</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        A modern, free, and open-source resume builder designed to help job seekers 
                        create professional, ATS-friendly resumes in minutes.
                    </p>
                </div>

                {/* Admin/Creator Section */}
                <div className="mb-20 animate-fade-in-up animation-delay-200">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <img 
                                    src={adminInfo.avatar}
                                    alt={adminInfo.name}
                                    className="relative w-40 h-40 rounded-full border-4 border-white/20 shadow-xl transition-transform group-hover:scale-105"
                                />
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-white">{adminInfo.name}</h2>
                                    <FaStar className="w-5 h-5 text-yellow-400" />
                                </div>
                                <p className="text-lg text-purple-300 font-semibold mb-4">{adminInfo.role}</p>
                                <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-2xl">
                                    {adminInfo.bio}
                                </p>
                                
                                {/* Social Links */}
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <a 
                                        href={adminInfo.socials.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <FaGithub className="w-5 h-5 text-slate-300 group-hover:text-white" />
                                        <span className="text-slate-300 group-hover:text-white font-medium">GitHub</span>
                                    </a>
                                    {adminInfo.socials.linkedin && (
                                        <a 
                                            href={adminInfo.socials.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <FaLinkedin className="w-5 h-5 text-blue-400" />
                                            <span className="hidden sm:inline text-slate-300 group-hover:text-white font-medium">LinkedIn</span>
                                        </a>
                                    )}
                                    {adminInfo.socials.email && (
                                        <a 
                                            href={`mailto:${adminInfo.socials.email}`}
                                            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <FaEnvelope className="w-5 h-5 text-purple-400" />
                                            <span className="hidden sm:inline text-slate-300 group-hover:text-white font-medium">Email</span>
                                        </a>
                                    )}
                                    {adminInfo.socials.twitter && (
                                        <a 
                                            href={adminInfo.socials.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <FaTwitter className="w-5 h-5 text-sky-400" />
                                        </a>
                                    )}
                                    {adminInfo.socials.website && (
                                        <a 
                                            href={adminInfo.socials.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <FaGlobe className="w-5 h-5 text-green-400" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Description */}
                <div className="mb-20 animate-fade-in-up animation-delay-400">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">
                        About the <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Project</span>
                    </h2>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            <strong className="text-white">HireReady</strong> (formerly Resume Builder) is a powerful, 
                            completely free resume builder designed to help job seekers create professional, 
                            ATS-friendly resumes without any hassle. Built with modern web technologies, 
                            it offers a seamless experience from creation to download.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            No sign-up required, no hidden fees, no watermarks - just beautiful resumes ready 
                            for download in PDF format. The tool is designed with simplicity and effectiveness 
                            in mind, making professional resume creation accessible to everyone.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 font-medium">
                                Free Forever
                            </span>
                            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 font-medium">
                                Open Source
                            </span>
                            <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 font-medium">
                                No Registration
                            </span>
                            <span className="px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 font-medium">
                                ATS-Optimized
                            </span>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-20 animate-fade-in-up animation-delay-600">
                    <h2 className="text-4xl font-bold text-white mb-12 text-center">
                        Key <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Features</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-purple-500/30"
                            >
                                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-20 animate-fade-in-up animation-delay-800">
                    <h2 className="text-4xl font-bold text-white mb-12 text-center">
                        Built With <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Modern Tech</span>
                    </h2>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {techStack.map((tech, index) => (
                                <div 
                                    key={index}
                                    className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105"
                                >
                                    <tech.icon className={`w-12 h-12 ${tech.color}`} />
                                    <span className="text-white font-semibold text-center">{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contributors Section */}
                <div className="mb-20 animate-fade-in-up animation-delay-1000">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                        <FaUsers className="w-8 h-8 text-purple-400" />
                        <span>Amazing <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Contributors</span></span>
                    </h2>
                    <p className="text-slate-300 text-center mb-12 text-lg">
                        Special thanks to all the amazing people who have contributed to this project!
                    </p>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : contributors.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {contributors.map((contributor, index) => (
                                <a
                                    key={index}
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-purple-500/30"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                        <img 
                                            src={contributor.avatar_url}
                                            alt={contributor.login}
                                            className="relative w-16 h-16 rounded-full border-2 border-white/20 transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-semibold text-sm truncate w-full">{contributor.login}</p>
                                        <p className="text-slate-400 text-xs">{contributor.contributions} commits</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                            <p className="text-slate-300 text-lg">
                                Want to be the first contributor? Check out our{' '}
                                <a 
                                    href="https://github.com/Shanidhya01/Resume-Builder"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 font-semibold underline"
                                >
                                    GitHub repository
                                </a>
                                !
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
