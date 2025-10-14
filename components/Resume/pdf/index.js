import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import Section from './Section';
import ListItem from './ListItem';

// Register professional fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWfAZ9hiA.woff2', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Inter',
        fontSize: 11,
        lineHeight: 1.5,
        padding: 40,
        backgroundColor: '#FFFFFF',
        color: '#1F2937',
    },

    // Enhanced Header Styles
    header: {
        textAlign: 'center',
        marginBottom: 30,
        paddingBottom: 25,
        borderBottom: '3px solid #2563EB',
        position: 'relative',
    },

    headerBackground: {
        position: 'absolute',
        top: -10,
        left: -20,
        right: -20,
        bottom: 0,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
    },

    name: {
        fontSize: 32,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 10,
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },

    title: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2563EB',
        marginBottom: 15,
        letterSpacing: 0.5,
    },

    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 20,
        marginTop: 10,
    },

    contactItem: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: 500,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        border: '1px solid #E5E7EB',
    },

    // Enhanced Layout Styles
    twoColumn: {
        flexDirection: 'row',
        gap: 30,
    },

    leftColumn: {
        flex: 2,
    },

    rightColumn: {
        flex: 1,
    },

    // Enhanced Section Styles
    section: {
        marginBottom: 25,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 15,
        paddingBottom: 6,
        borderBottom: '2px solid #3B82F6',
        position: 'relative',
    },

    // Enhanced Content Styles
    experienceItem: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: '1px solid #F3F4F6',
    },

    jobTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 4,
        lineHeight: 1.3,
    },

    company: {
        fontSize: 12,
        fontWeight: 600,
        color: '#2563EB',
        marginBottom: 3,
    },

    dateLocationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    location: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: 500,
    },

    dateRange: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: 600,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        border: '1px solid #DBEAFE',
    },

    // Enhanced Skills Styles
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },

    skillItem: {
        fontSize: 9,
        fontWeight: 600,
        color: '#1F2937',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        border: '1px solid #BFDBFE',
    },

    // Enhanced Text Styles
    summaryText: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#374151',
        textAlign: 'justify',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 6,
        border: '1px solid #E5E7EB',
    },

    projectTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 3,
    },

    projectUrl: {
        fontSize: 10,
        color: '#2563EB',
        fontWeight: 500,
        marginBottom: 8,
    },

    // Enhanced Education Styles
    educationItem: {
        marginBottom: 15,
        backgroundColor: '#F0FDF4',
        padding: 10,
        borderRadius: 6,
        border: '1px solid #BBF7D0',
    },

    degree: {
        fontSize: 11,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 2,
    },

    institution: {
        fontSize: 10,
        fontWeight: 600,
        color: '#059669',
        marginBottom: 3,
    },

    educationDetails: {
        fontSize: 9,
        color: '#6B7280',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    gpa: {
        fontSize: 9,
        color: '#059669',
        fontWeight: 600,
        marginTop: 2,
    },

    // Enhanced Certificate Styles
    certificateItem: {
        marginBottom: 12,
        backgroundColor: '#FEF3C7',
        padding: 8,
        borderRadius: 6,
        border: '1px solid #FDE68A',
    },

    certificateTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 2,
    },

    certificateIssuer: {
        fontSize: 9,
        fontWeight: 600,
        color: '#D97706',
        marginBottom: 2,
    },

    certificateDate: {
        fontSize: 8,
        color: '#6B7280',
    },

    // Enhanced Language Styles
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: '#EDE9FE',
        padding: 6,
        borderRadius: 4,
        border: '1px solid #C4B5FD',
    },

    languageName: {
        fontSize: 10,
        fontWeight: 700,
        color: '#111827',
    },

    languageLevel: {
        fontSize: 8,
        fontWeight: 600,
        color: '#7C3AED',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
    },

    // Utility Styles
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },

    highlight: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
    },
});

const Resume = ({ data }) => {
    const resumeData = data || {};

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
            <ListItem key={index} style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 10, lineHeight: 1.5, color: '#374151' }}>
                    {point.replace('•', '').trim()}
                </Text>
            </ListItem>
        ));
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerBackground} />
                    <Text style={styles.name}>{resumeData.contact?.name || 'Your Name'}</Text>
                    <Text style={styles.title}>{resumeData.contact?.title || 'Your Job Title'}</Text>
                    <View style={styles.contactContainer}>
                        {resumeData.contact?.email && <Text style={styles.contactItem}>📧 {resumeData.contact.email}</Text>}
                        {resumeData.contact?.phone && <Text style={styles.contactItem}>📱 {resumeData.contact.phone}</Text>}
                        {resumeData.contact?.address && <Text style={styles.contactItem}>📍 {resumeData.contact.address}</Text>}
                        {resumeData.contact?.linkedin && <Text style={styles.contactItem}>💼 {resumeData.contact.linkedin}</Text>}
                        {resumeData.contact?.github && <Text style={styles.contactItem}>🔗 {resumeData.contact.github}</Text>}
                        {resumeData.contact?.portfolio && <Text style={styles.contactItem}>🌐 {resumeData.contact.portfolio}</Text>}
                    </View>
                </View>

                <View style={styles.twoColumn}>
                    <View style={styles.leftColumn}>
                        {/* Professional Summary */}
                        {resumeData.summary?.summary && (
                            <Section title="Professional Summary" style={styles.section}>
                                <Text style={styles.summaryText}>{resumeData.summary.summary}</Text>
                            </Section>
                        )}

                        {/* Experience */}
                        {resumeData.experience?.length > 0 && (
                            <Section title="Professional Experience" style={styles.section}>
                                {resumeData.experience.map((exp, index) => (
                                    <View key={index} style={styles.experienceItem}>
                                        <Text style={styles.jobTitle}>{exp.role || 'Job Title'}</Text>
                                        <Text style={styles.company}>{exp.company || 'Company Name'}</Text>
                                        <View style={styles.dateLocationContainer}>
                                            <Text style={styles.location}>{exp.location || 'Location'}</Text>
                                            <Text style={styles.dateRange}>{formatDate(exp.start)} - {formatDate(exp.end)}</Text>
                                        </View>
                                        {exp.description && renderBulletPoints(exp.description)}
                                    </View>
                                ))}
                            </Section>
                        )}

                        {/* Projects */}
                        {resumeData.projects?.length > 0 && (
                            <Section title="Key Projects" style={styles.section}>
                                {resumeData.projects.map((project, index) => (
                                    <View key={index} style={{ marginBottom: 15 }}>
                                        <Text style={styles.projectTitle}>{project.title || 'Project Title'}</Text>
                                        {project.url && <Text style={styles.projectUrl}>{project.url}</Text>}
                                        {project.description && renderBulletPoints(project.description)}
                                    </View>
                                ))}
                            </Section>
                        )}
                    </View>

                    <View style={styles.rightColumn}>
                        {/* Skills */}
                        {resumeData.skills?.skills && (
                            <Section title="Technical Skills" style={styles.section}>
                                <View style={styles.skillsContainer}>
                                    {resumeData.skills.skills.split(',').map((skill, index) => (
                                        <Text key={index} style={styles.skillItem}>{skill.trim()}</Text>
                                    ))}
                                </View>
                            </Section>
                        )}

                        {/* Education */}
                        {resumeData.education?.length > 0 && (
                            <Section title="Education" style={styles.section}>
                                {resumeData.education.map((edu, index) => (
                                    <View key={index} style={styles.educationItem}>
                                        <Text style={styles.degree}>{edu.degree || 'Degree'}</Text>
                                        <Text style={styles.institution}>{edu.institution || 'Institution'}</Text>
                                        <View style={styles.educationDetails}>
                                            <Text>{edu.location}</Text>
                                            <Text>{formatDate(edu.start)} - {formatDate(edu.end)}</Text>
                                        </View>
                                        {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                                    </View>
                                ))}
                            </Section>
                        )}

                        {/* Certifications */}
                        {resumeData.certificates?.length > 0 && (
                            <Section title="Certifications" style={styles.section}>
                                {resumeData.certificates.map((cert, index) => (
                                    <View key={index} style={styles.certificateItem}>
                                        <Text style={styles.certificateTitle}>{cert.title || 'Certificate'}</Text>
                                        <Text style={styles.certificateIssuer}>{cert.issuer || 'Issuer'}</Text>
                                        <Text style={styles.certificateDate}>{formatDate(cert.date)}</Text>
                                    </View>
                                ))}
                            </Section>
                        )}

                        {/* Languages */}
                        {resumeData.languages?.length > 0 && (
                            <Section title="Languages" style={styles.section}>
                                {resumeData.languages.map((lang, index) => (
                                    <View key={index} style={styles.languageItem}>
                                        <Text style={styles.languageName}>{lang.language || 'Language'}</Text>
                                        <Text style={styles.languageLevel}>{lang.proficiency || 'Proficiency'}</Text>
                                    </View>
                                ))}
                            </Section>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};


export default Resume;