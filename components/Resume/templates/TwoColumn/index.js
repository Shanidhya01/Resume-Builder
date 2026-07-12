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
import styles from './styles';

const TwoColumnTemplate = ({ data }) => {
    const { contact, education, experience, projects, summary, skills, certificates, languages } = data;

    return (
        <Document language="en">
            <Page size="A4" style={styles.page}>
                <View style={styles.headerBar}>
                    <Header contact={contact} styles={styles} />
                </View>

                <View style={styles.columns}>
                    <View style={styles.columnLeft}>
                        <SkillsSection skills={skills?.skills} styles={styles} />
                        <EducationSection data={education} styles={styles} />
                        <CertificatesSection data={certificates} styles={styles} />
                        <LanguagesSection data={languages} styles={styles} stacked />
                    </View>

                    <View style={styles.columnRight}>
                        <SummarySection summary={summary?.summary} styles={styles} />
                        <ExperienceSection data={experience} styles={styles} />
                        <ProjectsSection data={projects} styles={styles} />
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default TwoColumnTemplate;
