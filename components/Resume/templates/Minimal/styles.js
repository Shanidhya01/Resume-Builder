import { StyleSheet } from '@react-pdf/renderer';

// Minimal: no color, no rules, tight leading — pure typography hierarchy.
const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 40, fontFamily: 'Helvetica', fontSize: 10 },

    header: { marginBottom: 14, borderBottom: '0.5px solid #ccc', paddingBottom: 10 },
    headerName: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#000', letterSpacing: 1.5, textTransform: 'uppercase' },
    headerTitle: { fontSize: 10, color: '#555', marginTop: 3, letterSpacing: 0.5 },
    headerLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
    headerLink: { fontSize: 8.5, color: '#555', textDecoration: 'none' },

    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: '#000', textTransform: 'uppercase', letterSpacing: 2 },
    sectionUnderline: null,
    sectionEnd: { height: 9 },

    bodyText: { fontSize: 9.8, lineHeight: 1.5, color: '#333', marginTop: 4 },

    entryWrapper: { marginTop: 5 },
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10 },
    entryTitle: { fontFamily: 'Helvetica-Bold', color: '#000' },
    entryDate: { fontSize: 8.5, color: '#888' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9, marginBottom: 2, color: '#555' },
    entrySubtitle: { color: '#555' },
    entryLink: { fontSize: 8.5, color: '#555' },
    entryDivider: { height: 4 },
    entryList: { marginTop: 2 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: '#999' },
    listText: { fontSize: 9.3, lineHeight: 1.35, flex: 1, color: '#333' },

    skillLine: { fontSize: 9.8, marginBottom: 1, color: '#333' },

    languagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    languagesStacked: { flexDirection: 'column', gap: 3 },
    languageItem: { minWidth: 80 },
});

export default styles;
