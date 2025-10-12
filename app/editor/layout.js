import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: 'Resume Editor | HireReady - Build Professional Resumes',
  description: 'Create professional ATS-friendly resumes with our free resume builder. Real-time preview, modern templates, and instant PDF export.',
  keywords: 'resume builder, CV maker, ATS friendly, professional resume, free resume builder',
  robots: 'index, follow',
  openGraph: {
    title: 'Resume Editor | HireReady',
    description: 'Create professional ATS-friendly resumes with real-time preview',
    type: 'website',
  },
};

const layout = ({ children }) => {
  return (
    <div className={`${inter.variable} font-sans`}>
      {/* Enhanced layout container with modern styling */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-slow"></div>
          </div>
          <div className="absolute -top-1/2 -right-1/2 w-full h-full">
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full">
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-float-reverse"></div>
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        {/* Main content wrapper */}
        <div className="relative z-10">
          {/* Content container with enhanced styling */}
          <div className="relative">
            {/* Subtle top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            
            {/* Enhanced content area */}
            <div className="relative backdrop-blur-[0.5px]">
              {children}
            </div>
            
            {/* Subtle bottom border gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
        <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default layout;