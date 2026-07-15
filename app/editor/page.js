import Editor from '@/components/Editor';
import Preview from '@/components/Resume/PreviewClient';
import Tabs from '@/components/Tabs';
import TemplateSwitcher from '@/components/Resume/TemplateSwitcher';
import ResumeFields from '@/config/ResumeFields';

const DEFAULT_TAB = 'contact';

export const dynamic = 'force-dynamic';

const page = async ({ searchParams }) => {
    const resolvedSearchParams = await searchParams;
    const requestedTab = resolvedSearchParams?.tab;
    const tab = requestedTab && ResumeFields[requestedTab] ? requestedTab : DEFAULT_TAB;

    return (
        <div className="mx-auto mt-6 flex max-w-screen-xl flex-col-reverse gap-6 px-4 pb-10 md:mt-10 md:flex-row 2xl:mt-14 2xl:max-w-screen-2xl 2xl:gap-10">

            {/* Live preview — sticky on desktop so it stays in view while editing. */}
            <div className="flex-1 md:sticky md:top-24 md:self-start">
                <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-sm">
                    <Preview />
                </div>
            </div>

            {/* Editor + section navigation */}
            <div className="flex flex-1 flex-col gap-4">
                <div className="rounded-2xl border border-line bg-surface p-4 shadow-ds-sm md:p-6">
                    <h2 className="mb-3 text-sm font-semibold text-fg md:text-base">Template</h2>
                    <TemplateSwitcher />
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4 shadow-ds-sm md:p-6">
                    <Tabs activeTab={tab} />
                </div>

                <div className="flex-grow rounded-2xl border border-line bg-surface p-4 shadow-ds-sm md:p-6">
                    <Editor tab={tab} />
                </div>
            </div>
        </div>
    );
};

export default page;
