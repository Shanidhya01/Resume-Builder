import React from 'react'
import { useState,useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      if(setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  }

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if(setPreview){
      setPreview(null);
    }
  }

  const onChooseFile = () => {
    inputRef.current.click();
  }
  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />
      {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative'>
          <LuUser className='text-4xl text-purple-500'/>
            <button
              type='button'
              className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
              onClick={onChooseFile}
            >
              <LuUpload />
            </button>
        </div>
      ) : (
        <div className='relative'>
          <img 
            src={preview || previewUrl} 
            alt='Profile Photo' 
            className='w-20 h-20 rounded-full object-cover' 
          />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector;
