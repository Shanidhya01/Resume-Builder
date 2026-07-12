import { StyleSheet } from '@react-pdf/renderer';

const ACCENT = '#DB2777';
const SIDEBAR_BG = '#111827';

// Creative: colored sidebar for identity/skills, wide main column for narrative content.
const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', color: '#333', fontFamily: 'Helvetica', fontSize: 10.5, flexDirection: 'row' },

    sidebar: { width: '32%', backgroundColor: SIDEBAR_BG, color: '#fff', padding: 20 },
    main: { width: '68%', padding: 26 },

    header: { marginBottom: 14 },
    headerName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#fff' },
    headerTitle: { fontSize: 10.5, color: ACCENT, marginTop: 3, fontFamily: 'Helvetica-Bold' },
    headerLinks: { flexDirection: 'column', gap: 4, marginTop: 10 },
    headerLink: { fontSize: 8.5, color: '#e5e7eb', textDecoration: 'none' },

    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.8 },
    sectionUnderline: { height: 1.5, backgroundColor: ACCENT, width: 24, margin: '3px 0 6px 0' },
    sectionEnd: { height: 10 },

    // Sidebar variants of the same section keys — reused via a separate
    // styles object (sidebarStyles below) passed to shared section components.
    bodyText: { fontSize: 10, lineHeight: 1.5, color: '#444' },

    entryWrapper: {},
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 11 },
    entryTitle: { fontFamily: 'Helvetica-Bold', color: '#222' },
    entryDate: { fontSize: 9, color: '#888' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10, marginBottom: 3, color: ACCENT },
    entrySubtitle: { color: ACCENT, fontFamily: 'Helvetica-Bold' },
    entryLink: { fontSize: 9, color: ACCENT },
    entryDivider: { height: 8 },
    entryList: { marginTop: 3 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: ACCENT },
    listText: { fontSize: 9.5, lineHeight: 1.4, flex: 1, color: '#444' },

    skillLine: { fontSize: 10, marginBottom: 2, color: '#444' },

    languagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    languagesStacked: { flexDirection: 'column', gap: 4 },
    languageItem: { minWidth: 80 },
});

// A parallel style set for content rendered *inside* the dark sidebar
// (skills/education/languages), reusing the exact same shared section
// components with light-on-dark colors instead of duplicating their JSX.
export const sidebarStyles = StyleSheet.create({
    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10.5, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.8 },
    sectionUnderline: { height: 1.5, backgroundColor: ACCENT, width: 20, margin: '3px 0 6px 0' },
    sectionEnd: { height: 12 },

    bodyText: { fontSize: 9.5, lineHeight: 1.4, color: '#e5e7eb' },

    entryWrapper: {},
    entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9.5 },
    entryTitle: { fontFamily: 'Helvetica-Bold', color: '#fff' },
    entryDate: { fontSize: 8.5, color: '#9ca3af' },
    entrySubtitleRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9, marginBottom: 2 },
    entrySubtitle: { color: '#d1d5db' },
    entryLink: { fontSize: 8.5, color: '#e5e7eb' },
    entryDivider: { height: 6 },
    entryList: { marginTop: 2 },

    listRow: { flexDirection: 'row' },
    listBullet: { color: ACCENT },
    listText: { fontSize: 9, lineHeight: 1.3, flex: 1, color: '#e5e7eb' },

    skillLine: { fontSize: 9.5, marginBottom: 2, color: '#e5e7eb' },

    languagesRow: { flexDirection: 'column', gap: 4 },
    languagesStacked: { flexDirection: 'column', gap: 4 },
    languageItem: { minWidth: 60 },
});

export default styles;
