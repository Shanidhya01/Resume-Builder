import Section from './Section';
import ListItem from './ListItem';

const Renderer = ({ data }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr === 'Present') return 'Present';
        try {
            const [year, month] = dateStr.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const renderBulletPoints = (text) => {
        if (!text) return null;
        const points = text.split('\n').filter(point => point.trim());
        return points.map((point, index) => (
            <ListItem key={index}>
                <span className="text-sm md:text-base leading-relaxed">
                    {point.replace('•', '').trim()}
                </span>
            </ListItem>
        ));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-[800px] relative">
            {/* Enhanced Header Section */}
            <header className="text-center mb-12 pb-8 border-b-2 border-gradient-to-r from-blue-500 to-purple-600 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 rounded-t-2xl -mx-8 -mt-8"></div>
                
                <div className="relative z-10 pt-8">
                    {/* Enhanced Name */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                        {data.contact?.name || 'Your Name'}
                    </h1>
                    
                    {/* Enhanced Title */}
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-6 tracking-wide">
                        {data.contact?.title || 'Your Job Title'}
                    </h2>
                    
                    {/* Enhanced Contact Info */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
                        {data.contact?.email && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-blue-500">📧</span>
                                <span className="font-medium">{data.contact.email}</span>
                            </div>
                        )}
                        {data.contact?.phone && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-green-500">📱</span>
                                <span className="font-medium">{data.contact.phone}</span>
                            </div>
                        )}
                        {data.contact?.address && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-red-500">📍</span>
                                <span className="font-medium">{data.contact.address}</span>
                            </div>
                        )}
                        {data.contact?.linkedin && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-blue-600">💼</span>
                                <span className="font-medium">{data.contact.linkedin}</span>
                            </div>
                        )}
                        {data.contact?.github && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-gray-700">🔗</span>
                                <span className="font-medium">{data.contact.github}</span>
                            </div>
                        )}
                        {data.contact?.portfolio && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-purple-500">🌐</span>
                                <span className="font-medium">{data.contact.portfolio}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Professional Summary */}
                    {data.summary?.summary && (
                        <Section title="Professional Summary" icon="🎯">
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-700 leading-relaxed text-justify bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                                    {data.summary.summary}
                                </p>
                            </div>
                        </Section>
                    )}

                    {/* Professional Experience */}
                    {data.experience?.length > 0 && (
                        <Section title="Professional Experience" icon="💼">
                            <div className="space-y-8">
                                {data.experience.map((exp, index) => (
                                    <div key={index} className="group relative bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                                        {/* Job Title */}
                                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            {exp.role || 'Job Title'}
                                        </h3>
                                        
                                        {/* Company */}
                                        <h4 className="text-lg font-semibold text-blue-600 mb-2">
                                            {exp.company || 'Company Name'}
                                        </h4>
                                        
                                        {/* Date and Location */}
                                        <div className="flex flex-wrap justify-between items-center mb-4 text-sm text-slate-600">
                                            <span className="font-medium">{exp.location || 'Location'}</span>
                                            <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                                                {formatDate(exp.start)} - {formatDate(exp.end)}
                                            </span>
                                        </div>
                                        
                                        {/* Description */}
                                        {exp.description && (
                                            <div className="space-y-2">
                                                {renderBulletPoints(exp.description)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Projects */}
                    {data.projects?.length > 0 && (
                        <Section title="Key Projects" icon="🚀">
                            <div className="space-y-6">
                                {data.projects.map((project, index) => (
                                    <div key={index} className="group bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                                            {project.title || 'Project Title'}
                                        </h3>
                                        
                                        {project.url && (
                                            <p className="text-sm text-blue-600 font-medium mb-3 hover:underline cursor-pointer">
                                                {project.url}
                                            </p>
                                        )}
                                        
                                        {project.description && (
                                            <div className="space-y-2">
                                                {renderBulletPoints(project.description)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-8">
                    {/* Skills */}
                    {data.skills?.skills && (
                        <Section title="Technical Skills" icon="⚡">
                            <div className="flex flex-wrap gap-2">
                                {data.skills.skills.split(',').map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-slate-700 text-sm font-medium rounded-lg border border-blue-200 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Education */}
                    {data.education?.length > 0 && (
                        <Section title="Education" icon="🎓">
                            <div className="space-y-6">
                                {data.education.map((edu, index) => (
                                    <div key={index} className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
                                        <h3 className="font-bold text-slate-800 mb-1 text-sm">
                                            {edu.degree || 'Degree'}
                                        </h3>
                                        <h4 className="font-semibold text-green-600 mb-2 text-sm">
                                            {edu.institution || 'Institution'}
                                        </h4>
                                        <p className="text-xs text-slate-600 mb-1">
                                            {edu.location} | {formatDate(edu.start)} - {formatDate(edu.end)}
                                        </p>
                                        {edu.gpa && (
                                            <p className="text-xs text-slate-700 font-medium">
                                                GPA: {edu.gpa}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Certifications */}
                    {data.certificates?.length > 0 && (
                        <Section title="Certifications" icon="🏆">
                            <div className="space-y-4">
                                {data.certificates.map((cert, index) => (
                                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                                        <h3 className="font-bold text-slate-800 mb-1 text-sm">
                                            {cert.title || 'Certificate'}
                                        </h3>
                                        <p className="text-sm text-orange-600 font-medium mb-1">
                                            {cert.issuer || 'Issuer'}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                            {formatDate(cert.date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Languages */}
                    {data.languages?.length > 0 && (
                        <Section title="Languages" icon="🌍">
                            <div className="space-y-3">
                                {data.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200">
                                        <span className="font-semibold text-slate-800 text-sm">
                                            {lang.language || 'Language'}
                                        </span>
                                        <span className="text-xs text-indigo-600 font-medium px-2 py-1 bg-white rounded-full">
                                            {lang.proficiency || 'Proficiency'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Renderer;
