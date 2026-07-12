import { Text, View } from '@react-pdf/renderer';

// Shared bullet-list row used by every template. Templates only pass in
// their own `styles.listRow` / `styles.listBullet` so the markup and bullet
// glyph logic lives in exactly one place.
const ListItem = ({ children, styles }) => (
    <View style={styles.listRow}>
        <View style={styles.listBullet}>
            <Text>{'• '}</Text>
        </View>
        <Text style={styles.listText}>{children}</Text>
    </View>
);

export default ListItem;
