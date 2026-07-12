import { StyleSheet } from '@react-pdf/renderer';

// ATS: single column, no colors, no tables — optimized for parsing engines.
const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', color: '#222', padding: 36, fontFamily: 'Helvetica', fontSize: 10.5 },

    header: { marginBottom: 10 },
    headerName: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#000' },
    headerTitle: { fontSize: 11, color: '#333', marginTop: 2 },
    headerLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
    headerLink: { fontSize: 9.5, color: '#333', textDecoration: 'none' },

    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11.5, textTransform: 'uppercase', color: '#000', marginTop: 4 },
    sectionUnderline: { height: 1, backgroundColor: '#000', margin: '3px 0 6px 0' },
    sectionEnd: { height: 6 },

    bodyText: { fontSize: 10.5, lineHeight: 1.4 },

    entryWrapper: {},
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 11 },
    entryTitle: { fontFamily: 'Helvetica-Bold', color: '#000' },
    entryDate: { fontSize: 9.5, color: '#444' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 },
    entrySubtitle: { color: '#333' },
    entryLink: { fontSize: 9.5, color: '#333' },
    entryDivider: { height: 6 },
    entryList: { marginTop: 2 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: '#000' },
    listText: { fontSize: 10, lineHeight: 1.35, flex: 1 },

    skillLine: { fontSize: 10.5, marginBottom: 1 },

    languagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    languagesStacked: { flexDirection: 'column', gap: 4 },
    languageItem: { minWidth: 90 },
});

export default styles;
