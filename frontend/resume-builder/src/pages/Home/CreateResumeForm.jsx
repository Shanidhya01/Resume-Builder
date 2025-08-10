import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';

const CreateResumeForm = () => {
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const onTitleChange = (arg) => {
    // Works whether Input calls onChange with event or value
    const next = typeof arg === 'string' ? arg : arg?.target?.value ?? '';
    setTitle(next);
    if (error) setError(null);
  };

  //Handle create Resume
  const handleCreateResume = async (e) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: trimmed,
      });

      console.log("Create resume response:", response);

      const payload = response?.data ?? {};
      const created = payload.data ?? payload.resume ?? payload;
      const id = created._id ?? created.id ?? created.resumeId;

      if (id) {
        navigate(`/resume/${id}`, { state: { title: trimmed } });
      } else {
        setError(payload.message || "Failed to create resume");
      }
    } catch (error) {
      console.error("Create resume error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to create resume");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create New Resume</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-3'>
        Give your resume a title to get started. You can change it later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={onTitleChange}
          label="Resume Title"
          placeholder="Enter resume title"
          type="text"
          required
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary' disabled={loading || !title.trim()}>
          {loading ? 'Creating...' : 'Create Resume'}
        </button>
      </form>
    </div>
  )
}

export default CreateResumeForm
