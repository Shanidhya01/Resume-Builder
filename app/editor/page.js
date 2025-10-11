import Editor from '@/components/Editor';
import Tabs from '@/components/Tabs';
import ResumeFields from '@/config/ResumeFields';
import dynamic from 'next/dynamic';

// Client-only PDF preview
const Preview = dynamic(() => import('@/components/Resume/Preview'), {
  ssr: false,
  loading: () => <div>Loading preview…</div>,
});

const normalize = (t) => {
  const key = String(t || 'contact').toLowerCase();
  return Object.prototype.hasOwnProperty.call(ResumeFields, key) ? key : 'contact';
};

const page = ({ searchParams: { tab = 'contact' } }) => {
  return (
    <div className="mx-auto mt-8 flex max-w-screen-xl 2xl:max-w-screen-2xl flex-col-reverse gap-10 px-3 pb-8 md:flex-row md:mt-8 2xl:mt-14 2xl:gap-16">
      <Preview />
      <div className="flex-grow ">
        <Tabs activeTab={tab} />
        <Editor tab={normalize(tab)} />
      </div>
    </div>
  );
};

export default page;
