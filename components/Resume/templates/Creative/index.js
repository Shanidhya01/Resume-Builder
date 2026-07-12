import { Document, Page, View } from '@react-pdf/renderer';
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
import styles, { sidebarStyles } from './styles';

// Sidebar layout: identity + skills + education live in the dark sidebar,
// experience/projects/certificates form the main narrative column.
const CreativeTemplate = ({ data }) => {
    const { contact, education, experience, projects, summary, skills, certificates, languages } = data;

    return (
        <Document language="en">
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar}>
                    <Header contact={contact} styles={styles} />
                    <SkillsSection skills={skills?.skills} styles={sidebarStyles} />
                    <EducationSection data={education} styles={sidebarStyles} />
                    <LanguagesSection data={languages} styles={sidebarStyles} stacked />
                </View>

                <View style={styles.main}>
                    <SummarySection summary={summary?.summary} styles={styles} />
                    <ExperienceSection data={experience} styles={styles} />
                    <ProjectsSection data={projects} styles={styles} />
                    <CertificatesSection data={certificates} styles={styles} />
                </View>
            </Page>
        </Document>
    );
};

export default CreativeTemplate;
