import styles from '../Styles';
import { Text, View } from './Renderer';

const Section = ({ title, children, icon, className = '' }) => {
    return (
        <section className={`group relative ${className}`}>
            {/* Enhanced section header */}
            <div className="relative mb-6">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg -mx-2 -my-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Section title with icon */}
                <div className="relative flex items-center gap-3 mb-4">
                    {icon && (
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                        {title}
                    </h2>
                </div>
                
                {/* Enhanced underline */}
                <div className="relative h-1 bg-gradient-to-r from-slate-200 to-transparent rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                </div>
            </div>
            
            {/* Content with enhanced styling */}
            <div className="relative">
                {children}
            </div>
        </section>
    );
};

export default Section;
