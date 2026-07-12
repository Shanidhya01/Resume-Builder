import { StyleSheet } from '@react-pdf/renderer';

const ACCENT = '#6F42C1';

// Modern: centered header, accent-colored rules, airy spacing.
const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', color: '#333', padding: 34, fontFamily: 'Helvetica', fontSize: 10.5 },

    header: { alignItems: 'center', textAlign: 'center', marginBottom: 12 },
    headerName: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#111', letterSpacing: 0.5 },
    headerTitle: { fontSize: 12, color: ACCENT, fontFamily: 'Helvetica-Bold', marginTop: 3 },
    headerLinks: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginTop: 8 },
    headerLink: { fontSize: 9.5, color: '#555', textDecoration: 'none' },

    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1 },
    sectionUnderline: { height: 2, backgroundColor: ACCENT, width: 32, borderRadius: 1, margin: '4px 0 8px 0' },
    sectionEnd: { height: 10 },

    bodyText: { fontSize: 10.5, lineHeight: 1.5, color: '#444' },

    entryWrapper: {},
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 11.5 },
    entryTitle: { fontFamily: 'Helvetica-Bold', color: '#222' },
    entryDate: { fontSize: 9.5, color: '#888', fontFamily: 'Helvetica-Oblique' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 3, color: ACCENT },
    entrySubtitle: { color: ACCENT, fontFamily: 'Helvetica-Bold' },
    entryLink: { fontSize: 9.5, color: ACCENT },
    entryDivider: { height: 8 },
    entryList: { marginTop: 3 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: ACCENT },
    listText: { fontSize: 10, lineHeight: 1.4, flex: 1, color: '#444' },

    skillLine: { fontSize: 10.5, marginBottom: 2, color: '#444' },

    languagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
    languagesStacked: { flexDirection: 'column', gap: 5 },
    languageItem: { minWidth: 95 },
});

export default styles;
