import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        color: '#2D3748',
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
    },

    header: {
        textAlign: 'center',
        marginBottom: 25,
        paddingBottom: 20,
        borderBottom: '2px solid #3182CE',
    },

    header__name: {
        color: '#1A202C',
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    header__title: {
        color: '#3182CE',
        fontSize: 14,
        fontFamily: 'Helvetica-Oblique',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.3,
    },

    header__links: {
        color: '#4A5568',
        fontSize: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 8,
        marginBottom: 6,
        flexWrap: 'wrap',
    },

    section: {
        marginBottom: 20,
    },

    section__title: {
        color: '#1A202C',
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        paddingBottom: 4,
        borderBottom: '1px solid #E2E8F0',
    },

    title_wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        fontSize: 12,
        marginBottom: 6,
    },

    subTitle_wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        fontSize: 11,
        marginBottom: 4,
        color: '#4A5568',
    },

    title: {
        fontFamily: 'Helvetica-Bold',
        marginRight: 'auto',
        color: '#2D3748',
        fontSize: 12,
        lineHeight: 1.4,
    },

    subtitle: {
        fontFamily: 'Helvetica-Oblique',
        color: '#3182CE',
        fontSize: 11,
        marginBottom: 2,
    },

    company: {
        fontFamily: 'Helvetica-Bold',
        color: '#4A5568',
        fontSize: 11,
    },

    location: {
        fontFamily: 'Helvetica',
        color: '#718096',
        fontSize: 10,
        fontStyle: 'italic',
    },

    date: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#718096',
        textAlign: 'right',
        minWidth: 80,
    },

    line: {
        borderBottom: '1px solid #E2E8F0',
        margin: '8px 0px',
    },

    lists: {
        fontSize: 10.5,
        marginTop: 4,
        marginBottom: 8,
        lineHeight: 1.6,
        color: '#2D3748',
    },

    list_item: {
        marginBottom: 3,
        paddingLeft: 12,
        position: 'relative',
    },

    bullet: {
        position: 'absolute',
        left: 0,
        color: '#3182CE',
        fontWeight: 'bold',
    },

    link: {
        color: '#3182CE',
        textDecoration: 'none',
    },

    skills_container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 6,
    },

    skill_item: {
        backgroundColor: '#F7FAFC',
        color: '#2D3748',
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        border: '1px solid #E2E8F0',
    },

    summary: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#2D3748',
        textAlign: 'justify',
        marginBottom: 4,
    },

    contact_item: {
        fontSize: 10,
        color: '#4A5568',
        marginRight: 16,
    },

    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 15,
    },

    // Two-column layout styles
    two_column: {
        display: 'flex',
        flexDirection: 'row',
        gap: 30,
    },

    left_column: {
        flex: 2,
    },

    right_column: {
        flex: 1,
    },

    // Enhanced typography
    emphasis: {
        fontFamily: 'Helvetica-Bold',
        color: '#1A202C',
    },

    muted: {
        color: '#718096',
        fontSize: 10,
    },

    // Project specific styles
    project_title: {
        fontFamily: 'Helvetica-Bold',
        color: '#2D3748',
        fontSize: 11,
        marginBottom: 2,
    },

    project_link: {
        color: '#3182CE',
        fontSize: 10,
        fontFamily: 'Helvetica-Oblique',
        marginBottom: 4,
    },

    // Education specific styles
    degree: {
        fontFamily: 'Helvetica-Bold',
        color: '#2D3748',
        fontSize: 11,
    },

    institution: {
        fontFamily: 'Helvetica-Oblique',
        color: '#3182CE',
        fontSize: 11,
        marginBottom: 2,
    },

    gpa: {
        fontSize: 10,
        color: '#4A5568',
        marginTop: 2,
    },

    // Certificate styles
    certificate_title: {
        fontFamily: 'Helvetica-Bold',
        color: '#2D3748',
        fontSize: 10,
    },

    certificate_issuer: {
        fontFamily: 'Helvetica',
        color: '#4A5568',
        fontSize: 10,
    },

    certificate_date: {
        fontSize: 9,
        color: '#718096',
        marginTop: 1,
    },

    // Language styles
    language_name: {
        fontFamily: 'Helvetica-Bold',
        color: '#2D3748',
        fontSize: 10,
    },

    language_level: {
        fontSize: 9,
        color: '#4A5568',
        marginTop: 1,
    },

    // Spacing utilities
    mb_small: {
        marginBottom: 4,
    },

    mb_medium: {
        marginBottom: 8,
    },

    mb_large: {
        marginBottom: 12,
    },

    mt_small: {
        marginTop: 4,
    },

    mt_medium: {
        marginTop: 8,
    },

    // Border utilities
    border_light: {
        borderBottom: '1px solid #F7FAFC',
    },

    border_medium: {
        borderBottom: '1px solid #E2E8F0',
    },

    border_dark: {
        borderBottom: '1px solid #CBD5E0',
    },
});

export default styles;
