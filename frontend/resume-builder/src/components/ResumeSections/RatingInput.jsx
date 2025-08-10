import React from 'react'

const RatingInput = ({ 
  value=0,
  total=5, 
  onChange=() => {},
  color = "#9125E6",
  bgColor = "#E9D4FF",
}) => {
  // Calculate the display value based on the total
  const displayValue = Math.round((value/100)*total);

  const handleClick = (index) => {
    const newValue = Math.round(((index + 1)/total) * 100);
    onChange(newValue);
  }
  return (
    <div className='flex gap-3 cursor-pointer'>
      {[...Array(total)].map((_, index) => {
        const isActive = index < displayValue;
        return (
          <div
            key={index}
            className={`inline-block cursor-pointer p-1 ${isActive ? `bg-[${bgColor}]` : 'bg-gray-200'}`}
            onClick={() => handleClick(index)}
            style={{
              backgroundColor: isActive ? bgColor : 'transparent',
            }}
          >
            <span className={`block w-2 h-2 rounded-full ${isActive ? `bg-[${color}]` : 'bg-gray-400'}`}></span>
          </div>
        );
      })}
    </div>
  )
}

export default RatingInput
