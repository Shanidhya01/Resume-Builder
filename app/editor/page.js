import Editor from '@/components/Editor';
import Tabs from '@/components/Tabs';
import ResumeFields from '@/config/ResumeFields';
import dynamic from 'next/dynamic';
import { HiDocumentText, HiEye, HiSparkles } from 'react-icons/hi';
import { IoMdCheckmarkCircle } from 'react-icons/io';

// Client-only PDF preview with enhanced loading
const Preview = dynamic(() => import('@/components/Resume/Preview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-sm">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <div className="absolute inset-0 w-10 h-10 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-700 font-semibold">Generating preview...</p>
          <p className="text-sm text-slate-500">This may take a moment</p>
        </div>
      </div>
    </div>
  ),
});

const normalize = (t) => {
  const key = String(t || 'contact').toLowerCase();
  return Object.prototype.hasOwnProperty.call(ResumeFields, key) ? key : 'contact';
};

const page = ({ searchParams: { tab = 'contact' } }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0">
        <div className="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <HiDocumentText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Resume Builder
                </h1>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <HiSparkles className="w-4 h-4 text-yellow-500" />
                  Create your professional resume
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium shadow-sm">
                <IoMdCheckmarkCircle className="w-4 h-4" />
                <span>Auto-saved</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium shadow-sm">
                <HiEye className="w-4 h-4" />
                <span>Live Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto mt-8 flex max-w-screen-xl 2xl:max-w-screen-2xl flex-col-reverse gap-8 px-6 pb-12 md:flex-row md:mt-8 2xl:mt-14 2xl:gap-16">
        
        {/* Preview Section */}
        <div className="md:w-1/2 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
              <HiEye className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Live Preview</h2>
              <p className="text-sm text-slate-600">See your resume as you build it</p>
            </div>
          </div>
          
          <div className="sticky top-32">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Preview container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
                <Preview />
              </div>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="md:w-1/2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <HiDocumentText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Resume Editor</h2>
              <p className="text-sm text-slate-600">Fill in your information section by section</p>
            </div>
          </div>

          {/* Editor Container */}
          <div className="relative group">
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl border border-white/60 shadow-xl overflow-hidden">
              {/* Tabs Section */}
              <div className="bg-gradient-to-r from-slate-50/80 to-white/80 border-b border-slate-200/50">
                <Tabs activeTab={tab} />
              </div>
              
              {/* Editor Content */}
              <div className="p-8">
                <Editor tab={normalize(tab)} />
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Resume Completion</span>
              <span className="text-sm font-bold text-blue-600">65%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">Keep going! Add more sections to improve your resume.</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-20">
        <button className="group p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <HiEye className="w-6 h-6 transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </div>
  );
};

export default page;
