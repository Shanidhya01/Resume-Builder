import { Document, Page } from '@react-pdf/renderer';
import Header from '../shared/Header';
import {
    SummarySection,
    EducationSection,
    ExperienceSection,
    ProjectsSection,
    SkillsSection,
    CertificatesSection,
    LanguagesSection,
} from '../shared/Sections';
import styles from './styles';

// Formal order favored for senior/leadership resumes: track record first,
// education and credentials deliberately placed after experience.
const ExecutiveTemplate = ({ data }) => {
    const { contact, education, experience, projects, summary, skills, certificates, languages } = data;

    return (
        <Document language="en">
            <Page size="A4" style={styles.page}>
                <Header contact={contact} styles={styles} />
                <SummarySection summary={summary?.summary} styles={styles} title="Executive Summary" />
                <ExperienceSection data={experience} styles={styles} />
                <ProjectsSection data={projects} styles={styles} title="Key Initiatives" />
                <EducationSection data={education} styles={styles} />
                <CertificatesSection data={certificates} styles={styles} />
                <SkillsSection skills={skills?.skills} styles={styles} title="Core Competencies" />
                <LanguagesSection data={languages} styles={styles} />
            </Page>
        </Document>
    );
};

export default ExecutiveTemplate;
