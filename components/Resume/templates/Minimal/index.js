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

// Left-aligned header with a rule, then a lean, uncluttered stack.
const MinimalTemplate = ({ data }) => {
    const { contact, education, experience, projects, summary, skills, certificates, languages } = data;

    return (
        <Document language="en">
            <Page size="A4" style={styles.page}>
                <Header contact={contact} styles={styles} />
                <SummarySection summary={summary?.summary} styles={styles} />
                <ExperienceSection data={experience} styles={styles} />
                <EducationSection data={education} styles={styles} />
                <ProjectsSection data={projects} styles={styles} />
                <SkillsSection skills={skills?.skills} styles={styles} />
                <CertificatesSection data={certificates} styles={styles} />
                <LanguagesSection data={languages} styles={styles} />
            </Page>
        </Document>
    );
};

export default MinimalTemplate;
