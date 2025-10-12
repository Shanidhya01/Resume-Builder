import { Text, View, StyleSheet } from '@react-pdf/renderer';

const ListItem = ({ children, className = '' }) => {
    return (
        <div className={`
            group relative mb-4 last:mb-0 transition-all duration-300 hover:transform hover:translate-x-1
            ${className}
        `}>
            {/* Enhanced bullet point */}
            <div className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
            
            {/* Content with enhanced styling */}
            <div className="pl-6 leading-relaxed text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                {children}
            </div>
            
            {/* Subtle hover effect line */}
            <div className="absolute left-6 bottom-0 h-px bg-gradient-to-r from-blue-200 to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
        </div>
    );
};

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    bullet: {
        height: '100%',
    },
});

export default ListItem;
