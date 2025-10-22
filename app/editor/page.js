import Editor from '@/components/Editor';
import Preview from '@/components/Resume/Preview';
import Tabs from '@/components/Tabs';

const page = ({ searchParams: { tab = 'contact' } }) => {
    return (
        <div className="mx-auto mt-10 flex max-w-screen-xl 2xl:max-w-screen-2xl flex-col-reverse gap-8 px-4 pb-10 md:flex-row md:mt-12 2xl:mt-16 2xl:gap-12">
            
            {/* Preview Panel */}
            <div className="flex-1 rounded-xl border border-[#6F42C1] shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                <Preview />
            </div>

            {/* Editor + Tabs Panel */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Tabs */}
                <div className="rounded-xl border border-[#6F42C1] shadow-md p-4 md:p-6 transition-shadow duration-300 hover:shadow-lg bg-transparent">
                    <Tabs activeTab={tab} />
                </div>

                {/* Editor */}
                <div className="rounded-xl border border-[#6F42C1] shadow-md p-4 md:p-6 transition-shadow duration-300 hover:shadow-lg flex-grow bg-transparent">
                    <Editor tab={tab} />
                </div>
            </div>
        </div>
    );
};

export default page;
