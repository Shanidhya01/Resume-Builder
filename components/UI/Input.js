'use client';

import { twMerge } from 'tailwind-merge';
import { sentenceCase } from 'change-case';
import ContentEditable from 'react-contenteditable';
import { useRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Input = ({ label, name, type, placeholder, options, span, value, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = value && value.toString().length > 0;
    
    const baseInputClassName = `
        block w-full rounded-xl border-2 transition-all duration-300 outline-none
        placeholder:text-slate-400 placeholder:font-medium
        text-slate-800 font-medium shadow-sm
        ${isFocused || hasValue 
            ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/10' 
            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white/80'
        }
        focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100
        p-3 text-sm md:text-base 2xl:p-4
    `;

    const inputRef = useRef(null);

    const InputEl = () => {
        if (type === 'textarea' && props.multipoints) {
            const html = `
                <ul class="space-y-2 list-none pl-0">
                    ${value
                        ?.split('\n')
                        ?.filter(line => line.trim())
                        ?.map(
                            line => `
                            <li class="relative pl-6 leading-relaxed before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:content-['']">
                                ${line || ''}
                            </li>
                            `,
                        )
                        .join('')}
                </ul>
            `;

            return (
                <div className="relative">
                    <ContentEditable
                        role="textbox"
                        html={value && html}
                        innerRef={inputRef}
                        className={twMerge(
                            baseInputClassName, 
                            'min-h-56 md:min-h-40 text-sm leading-relaxed resize-none'
                        )}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={e => {
                            const text = inputRef.current.innerText;
                            props.onChange({ target: { name, value: text } });
                        }}
                    />
                    {!value && (
                        <div className="absolute top-3 left-3 text-slate-400 font-medium pointer-events-none">
                            {placeholder || 'Enter bullet points...'}
                        </div>
                    )}
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <div className="relative">
                    <textarea
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        className={twMerge(baseInputClassName, 'min-h-56 md:min-h-40 resize-none leading-relaxed')}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    >
                        {value}
                    </textarea>
                </div>
            );
        }

        if (type === 'select') {
            return (
                <div className="relative">
                    <select
                        id={name}
                        name={name}
                        className={twMerge(
                            baseInputClassName, 
                            'cursor-pointer appearance-none bg-white pr-10',
                            'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat'
                        )}
                        defaultValue={value}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    >
                        <option value="" disabled className="text-slate-400">
                            {placeholder || `Select ${label}`}
                        </option>
                        {options?.map(option => (
                            <option key={option.value} value={option.value} className="text-slate-800">
                                {option?.name || option?.value}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        if (type === 'color') {
            return (
                <div className="relative">
                    <input
                        type="color"
                        name={name}
                        id={name}
                        className={twMerge(
                            baseInputClassName, 
                            'py-2 px-3 h-12 cursor-pointer',
                            'appearance-none border-2 rounded-xl'
                        )}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <div className="w-6 h-6 rounded border border-slate-300" style={{ backgroundColor: value || '#000000' }}></div>
                    </div>
                </div>
            );
        }

        if (type === 'password') {
            return (
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name={name}
                        id={name}
                        className={twMerge(baseInputClassName, 'pr-12')}
                        placeholder={placeholder || `Enter ${label}`}
                        defaultValue={type === 'file' ? undefined : props.defaultValue}
                        value={value}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1"
                    >
                        {showPassword ? (
                            <HiEyeOff className="w-5 h-5" />
                        ) : (
                            <HiEye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            );
        }

        if (type === 'file') {
            return (
                <div className="relative">
                    <input
                        type="file"
                        name={name}
                        id={name}
                        className="sr-only"
                        {...props}
                    />
                    <label
                        htmlFor={name}
                        className={twMerge(
                            baseInputClassName,
                            'cursor-pointer flex items-center justify-center gap-3 text-center',
                            'border-2 border-dashed hover:border-blue-400 hover:bg-blue-50/50'
                        )}
                    >
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>{placeholder || 'Choose file or drag and drop'}</span>
                    </label>
                </div>
            );
        }

        return (
            <input
                type={type ?? 'text'}
                name={name}
                id={name}
                className={baseInputClassName}
                placeholder={placeholder || `Enter ${label}`}
                defaultValue={type === 'file' ? undefined : props.defaultValue}
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        );
    };

    return (
        <div className={`space-y-2 ${span ? 'md:col-span-2' : ''}`}>
            {label && (
                <label 
                    htmlFor={name} 
                    className={`
                        block text-sm font-semibold transition-colors duration-300
                        ${isFocused || hasValue ? 'text-blue-600' : 'text-slate-700'}
                        md:text-base 2xl:text-lg
                    `}
                >
                    {label ?? sentenceCase(name)} 
                    {props.required && (
                        <span className="text-red-500 ml-1 font-bold">*</span>
                    )}
                </label>
            )}

            <div className="relative">
                {InputEl()}
                
                {/* Focus ring effect */}
                {isFocused && (
                    <div className="absolute inset-0 rounded-xl ring-4 ring-blue-500/20 pointer-events-none transition-all duration-300"></div>
                )}
            </div>

            {/* Helper text or error message can be added here */}
            {props.helperText && (
                <p className="text-xs text-slate-500 mt-1">
                    {props.helperText}
                </p>
            )}
        </div>
    );
};

export default Input;
