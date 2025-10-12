import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    
    bulletContainer: {
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginTop: 3,
    },
    
    bulletPoint: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
    },
    
    bulletText: {
        fontSize: 8,
        fontWeight: 700,
        color: '#3B82F6',
    },
    
    contentContainer: {
        flex: 1,
        paddingTop: 1,
    },
    
    // Alternative bullet styles
    bulletArrow: {
        fontSize: 10,
        color: '#2563EB',
        fontWeight: 700,
    },
    
    bulletDash: {
        width: 8,
        height: 1,
        backgroundColor: '#3B82F6',
        marginTop: 6,
    },
    
    bulletSquare: {
        width: 3,
        height: 3,
        backgroundColor: '#3B82F6',
        marginTop: 4,
    },
});

const ListItem = ({ children, style, bulletType = 'dot' }) => {
    const renderBullet = () => {
        switch (bulletType) {
            case 'arrow':
                return <Text style={styles.bulletArrow}>›</Text>;
            case 'dash':
                return <View style={styles.bulletDash} />;
            case 'square':
                return <View style={styles.bulletSquare} />;
            case 'text':
                return <Text style={styles.bulletText}>•</Text>;
            default:
                return <View style={styles.bulletPoint} />;
        }
    };

    return (
        <View style={[styles.listItemContainer, style]}>
            <View style={styles.bulletContainer}>
                {renderBullet()}
            </View>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

export default ListItem;
