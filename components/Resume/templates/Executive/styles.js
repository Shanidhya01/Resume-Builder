import { StyleSheet } from '@react-pdf/renderer';

// Executive: formal serif typography, centered header, traditional double rules.
const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', color: '#222', padding: 38, fontFamily: 'Times-Roman', fontSize: 11 },

    header: { alignItems: 'center', textAlign: 'center', marginBottom: 12, borderBottom: '1.5px solid #0F172A', paddingBottom: 10 },
    headerName: { fontSize: 22, fontFamily: 'Times-Bold', color: '#0F172A', letterSpacing: 1 },
    headerTitle: { fontSize: 11.5, color: '#334155', marginTop: 4, fontFamily: 'Times-Italic' },
    headerLinks: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginTop: 8 },
    headerLink: { fontSize: 9.5, color: '#334155', textDecoration: 'none' },

    sectionTitle: { fontFamily: 'Times-Bold', fontSize: 13, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center' },
    sectionUnderline: { height: 1, backgroundColor: '#0F172A', margin: '3px 0 8px 0' },
    sectionEnd: { height: 10 },

    bodyText: { fontSize: 10.8, lineHeight: 1.5, color: '#333', textAlign: 'justify' },

    entryWrapper: {},
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 11.5 },
    entryTitle: { fontFamily: 'Times-Bold', color: '#111' },
    entryDate: { fontSize: 10, fontFamily: 'Times-Italic', color: '#555' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 3 },
    entrySubtitle: { color: '#333', fontFamily: 'Times-Italic' },
    entryLink: { fontSize: 10, color: '#334155' },
    entryDivider: { height: 8, borderBottom: '0.5px solid #cbd5e1', margin: '4px 0' },
    entryList: { marginTop: 3 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: '#0F172A' },
    listText: { fontSize: 10.2, lineHeight: 1.4, flex: 1, color: '#333' },

    skillLine: { fontSize: 10.8, marginBottom: 2, color: '#333' },

    languagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, justifyContent: 'center' },
    languagesStacked: { flexDirection: 'column', gap: 5 },
    languageItem: { minWidth: 95, alignItems: 'center' },
});

export default styles;
