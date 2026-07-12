import { Text, View } from '@react-pdf/renderer';

// A titled section wrapper with a trailing spacer. Every template supplies
// its own `styles.sectionTitle` / `styles.sectionUnderline` / `styles.sectionEnd`
// so heading typography and rules can differ without duplicating the JSX shape.
const SectionHeading = ({ title, styles, children }) => (
    <View>
        {title && (
            <>
                <Text style={styles.sectionTitle}>{title}</Text>
                {styles.sectionUnderline && <View style={styles.sectionUnderline} />}
            </>
        )}
        {children}
        <View style={styles.sectionEnd} />
    </View>
);

export default SectionHeading;
