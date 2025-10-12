import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    
    titleContainer: {
        marginBottom: 12,
        position: 'relative',
        paddingBottom: 6,
    },
    
    title: {
        fontSize: 14,
        fontWeight: 700,
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    
    underline: {
        height: 2,
        backgroundColor: '#3B82F6',
        borderRadius: 1,
    },
    
    gradientUnderline: {
        height: 2,
        backgroundColor: '#2563EB',
        borderRadius: 1,
    },
    
    contentContainer: {
        paddingTop: 4,
    },
    
    // Alternative title styles
    titleWithBackground: {
        fontSize: 14,
        fontWeight: 700,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginBottom: 12,
    },
    
    titleWithBorder: {
        fontSize: 14,
        fontWeight: 700,
        color: '#3B82F6',
        textTransform: 'uppercase',
        letterSpacing: 1,
        border: '2px solid #3B82F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 12,
        textAlign: 'center',
    },
    
    titleMinimal: {
        fontSize: 16,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 8,
        borderLeft: '4px solid #3B82F6',
        paddingLeft: 8,
    },
    
    // Enhanced underline variants
    doubleUnderline: {
        borderBottom: '2px solid #3B82F6',
        borderTop: '1px solid #93C5FD',
        height: 4,
        marginBottom: 4,
    },
    
    dottedUnderline: {
        borderBottom: '2px dotted #3B82F6',
        height: 2,
        marginBottom: 4,
    },
});

const Section = ({ title, children, style, titleStyle = 'default', underlineStyle = 'solid' }) => {
    const renderTitle = () => {
        const titleText = title;
        
        switch (titleStyle) {
            case 'background':
                return <Text style={styles.titleWithBackground}>{titleText}</Text>;
            case 'border':
                return <Text style={styles.titleWithBorder}>{titleText}</Text>;
            case 'minimal':
                return <Text style={styles.titleMinimal}>{titleText}</Text>;
            default:
                return (
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{titleText}</Text>
                        {renderUnderline()}
                    </View>
                );
        }
    };
    
    const renderUnderline = () => {
        switch (underlineStyle) {
            case 'gradient':
                return <View style={styles.gradientUnderline} />;
            case 'double':
                return <View style={styles.doubleUnderline} />;
            case 'dotted':
                return <View style={styles.dottedUnderline} />;
            case 'none':
                return null;
            default:
                return <View style={styles.underline} />;
        }
    };

    return (
        <View style={[styles.section, style]}>
            {renderTitle()}
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

export default Section;
