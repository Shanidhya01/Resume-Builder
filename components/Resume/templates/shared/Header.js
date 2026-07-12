import { Link, Text, View } from '@react-pdf/renderer';

const CONTACT_FIELD_LABELS = [
    { key: 'phone', label: null },
    { key: 'email', label: null, hrefPrefix: 'mailto:' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'Github' },
    { key: 'blogs', label: 'Blogs' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'portfolio', label: 'Portfolio' },
];

// Builds the contact-links row shared by every template. `styles.headerLink`
// controls the visual style; templates decide layout (row vs stacked) via
// `styles.headerLinks` (flexDirection).
export const ContactLinks = ({ contact = {}, styles }) => {
    const resolvedLinks = CONTACT_FIELD_LABELS.map(({ key, label, hrefPrefix }) => {
        const raw = contact[key];
        if (!raw) return null;
        return { name: label ?? raw, value: `${hrefPrefix ?? ''}${raw}` };
    }).filter(Boolean);

    if (resolvedLinks.length === 0) return null;

    return (
        <View style={styles.headerLinks}>
            {resolvedLinks.map(({ name, value }) => (
                <Link key={name + value} src={value} style={styles.headerLink}>
                    {name}
                </Link>
            ))}
        </View>
    );
};

// Standard centered/left header: name, optional title, contact links.
const Header = ({ contact = {}, styles }) => (
    <View style={styles.header}>
        <Text style={styles.headerName}>{contact.name}</Text>
        {contact.title && <Text style={styles.headerTitle}>{contact.title}</Text>}
        <ContactLinks contact={contact} styles={styles} />
    </View>
);

export default Header;
