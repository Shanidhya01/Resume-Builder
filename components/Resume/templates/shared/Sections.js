import { Text, View } from '@react-pdf/renderer';
import SectionHeading from './SectionHeading';
import ListItem from './ListItem';
import formatDate from '@/utils/formatDate';

// All section-content renderers shared across every template. Templates
// never re-implement "how to render an experience entry" — they only pass
// their own `styles` object (typography/spacing/color) and choose which
// sections to include, in which order, in their own index.js layout.

const splitLines = text => (text ?? '').split('\n').filter(line => line.trim());

export const SummarySection = ({ summary, styles, title = 'Summary' }) => {
    if (!summary) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            <Text style={styles.bodyText}>{summary}</Text>
        </SectionHeading>
    );
};

export const EducationSection = ({ data = [], styles, title = 'Education' }) => {
    if (data.length === 0) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            {data.map(({ degree, institution, start, end, location, gpa }, i) => (
                <View key={i} style={styles.entryWrapper}>
                    <View style={styles.entryTitleRow}>
                        <Text style={styles.entryTitle}>{degree}</Text>
                        <Text style={styles.entryDate}>
                            {formatDate(start)} - {formatDate(end)}
                        </Text>
                    </View>
                    <View style={styles.entrySubtitleRow}>
                        <Text style={styles.entrySubtitle}>
                            {institution}
                            {gpa && <Text> ({gpa})</Text>}
                        </Text>
                        {location && <Text style={styles.entryDate}>{location}</Text>}
                    </View>
                    {i !== data.length - 1 && <View style={styles.entryDivider} />}
                </View>
            ))}
        </SectionHeading>
    );
};

export const ExperienceSection = ({ data = [], styles, title = 'Experience' }) => {
    if (data.length === 0) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            {data.map(({ role, start, end, company, location, description }, i) => (
                <View key={i} style={styles.entryWrapper}>
                    <View style={styles.entryTitleRow}>
                        <Text style={styles.entryTitle}>{role}</Text>
                        <Text style={styles.entryDate}>
                            {formatDate(start)} - {formatDate(end)}
                        </Text>
                    </View>
                    <View style={styles.entrySubtitleRow}>
                        <Text style={styles.entrySubtitle}>{company}</Text>
                        {location && <Text style={styles.entryDate}>{location}</Text>}
                    </View>
                    <View style={styles.entryList}>
                        {splitLines(description).map((line, li) => (
                            <ListItem key={li} styles={styles}>
                                {line}
                            </ListItem>
                        ))}
                    </View>
                    {i !== data.length - 1 && <View style={styles.entryDivider} />}
                </View>
            ))}
        </SectionHeading>
    );
};

export const ProjectsSection = ({ data = [], styles, title = 'Projects' }) => {
    if (data.length === 0) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            {data.map(({ title: projectTitle, url, description }, i) => (
                <View key={i} style={styles.entryWrapper}>
                    <View style={styles.entryTitleRow}>
                        <Text style={styles.entryTitle}>{projectTitle}</Text>
                    </View>
                    {url && (
                        <View style={styles.entrySubtitleRow}>
                            <Text style={styles.entryLink}>{url}</Text>
                        </View>
                    )}
                    <View style={styles.entryList}>
                        {splitLines(description).map((line, li) => (
                            <ListItem key={li} styles={styles}>
                                {line}
                            </ListItem>
                        ))}
                    </View>
                    {i !== data.length - 1 && <View style={styles.entryDivider} />}
                </View>
            ))}
        </SectionHeading>
    );
};

export const SkillsSection = ({ skills, styles, title = 'Skills' }) => {
    const lines = splitLines(skills);
    if (lines.length === 0) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            {lines.map((line, i) => (
                <Text key={i} style={styles.skillLine}>
                    {line}
                </Text>
            ))}
        </SectionHeading>
    );
};

export const CertificatesSection = ({ data = [], styles, title = 'Certifications' }) => {
    if (data.length === 0) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            {data.map(({ title: certTitle, issuer, date }, i) => (
                <View key={i} style={styles.entryWrapper}>
                    <View style={styles.entryTitleRow}>
                        <Text style={styles.entryTitle}>{certTitle}</Text>
                        <Text style={styles.entryDate}>{formatDate(date)}</Text>
                    </View>
                    {issuer && (
                        <View style={styles.entrySubtitleRow}>
                            <Text style={styles.entrySubtitle}>{issuer}</Text>
                        </View>
                    )}
                    {i !== data.length - 1 && <View style={styles.entryDivider} />}
                </View>
            ))}
        </SectionHeading>
    );
};

export const LanguagesSection = ({ data = [], styles, title = 'Languages', stacked = false }) => {
    if (data.length === 0) return null;
    return (
        <SectionHeading title={title} styles={styles}>
            <View style={stacked ? styles.languagesStacked : styles.languagesRow}>
                {data.map(({ language, proficiency }, i) => (
                    <View key={i} style={styles.languageItem}>
                        <Text style={styles.entryTitle}>{language}</Text>
                        <Text style={styles.entryDate}>{proficiency}</Text>
                    </View>
                ))}
            </View>
        </SectionHeading>
    );
};
