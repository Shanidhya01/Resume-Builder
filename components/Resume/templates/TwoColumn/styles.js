import { StyleSheet } from '@react-pdf/renderer';

const ACCENT = '#0369A1';

// Two Column: full-width header bar, then a narrow left column (skills,
// education, certificates, languages) beside a wide right column (summary,
// experience, projects) — fits more content per page than a single column.
const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', color: '#333', padding: 0, fontFamily: 'Helvetica', fontSize: 10 },

    headerBar: { backgroundColor: ACCENT, padding: '18px 30px', marginBottom: 4 },
    header: {},
    headerName: { fontSize: 19, fontFamily: 'Helvetica-Bold', color: '#fff' },
    headerTitle: { fontSize: 10.5, color: '#e0f2fe', marginTop: 2 },
    headerLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
    headerLink: { fontSize: 8.5, color: '#e0f2fe', textDecoration: 'none' },

    columns: { flexDirection: 'row', paddingHorizontal: 24 },
    columnLeft: { width: '36%', paddingRight: 14, paddingTop: 14 },
    columnRight: { width: '64%', paddingLeft: 14, paddingTop: 14, borderLeft: '0.5px solid #e2e8f0' },

    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10.5, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.6 },
    sectionUnderline: { height: 1.5, backgroundColor: ACCENT, width: 22, margin: '3px 0 6px 0' },
    sectionEnd: { height: 10 },

    bodyText: { fontSize: 9.8, lineHeight: 1.45, color: '#444' },

    entryWrapper: {},
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10 },
    entryTitle: { fontFamily: 'Helvetica-Bold', color: '#222' },
    entryDate: { fontSize: 8.5, color: '#888' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9.3, marginBottom: 2 },
    entrySubtitle: { color: ACCENT },
    entryLink: { fontSize: 8.5, color: ACCENT },
    entryDivider: { height: 7 },
    entryList: { marginTop: 2 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: ACCENT },
    listText: { fontSize: 9.3, lineHeight: 1.35, flex: 1, color: '#444' },

    skillLine: { fontSize: 9.6, marginBottom: 2, color: '#444' },

    languagesRow: { flexDirection: 'column', gap: 4 },
    languagesStacked: { flexDirection: 'column', gap: 4 },
    languageItem: { minWidth: 70 },
});

export default styles;
