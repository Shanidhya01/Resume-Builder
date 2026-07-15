'use client';

import { twMerge } from 'tailwind-merge';
import { sentenceCase } from 'change-case';
import ContentEditable from 'react-contenteditable';
import { useRef } from 'react';

const Input = ({ label, name, type, placeholder, options, span, value, ...props }) => {
    const inputClassName = `block w-full rounded-md border border-line bg-surface-2 p-2 text-sm text-fg shadow-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent md:text-base 2xl:p-2.5`;

    const inputRef = useRef(null);

    const InputEl = () => {
        if (type === 'textarea' && props.multipoints) {
            const html = `
                <ul class="space-y-1.5 list-disc pl-4 md:pl-5">
                    ${value
                        ?.split('\n')
                        ?.filter(line => line.trim())
                        ?.map(
                            line => `
                            <li>
                                ${line || ''}${' '}
                            </li>
                            `,
                        )
                        .join('')}
                </ul>
            `;

            return (
                <ContentEditable
                    role="textbox"
                    html={value && html}
                    innerRef={inputRef}
                    className={twMerge(inputClassName, 'min-h-56  text-sm md:min-h-40 md:text-sm ')}
                    onChange={e => {
                        const text = inputRef.current.innerText;
                        props.onChange({ target: { name, value: text } });
                    }}
                />
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className={twMerge(inputClassName, 'min-h-56 text-sm md:min-h-40')}
                    {...props}
                >
                    {value}
                </textarea>
            );
        }

        if (type == 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className={inputClassName}
                    defaultValue={value}
                    {...props}
                >
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option?.name || option?.value}
                        </option>
                    ))}
                </select>
            );
        }

        if (type == 'color') {
            return (
                <input
                    type={'color'}
                    name={name}
                    id={name}
                    className={twMerge(inputClassName, 'py-1')}
                    placeholder={placeholder || `Enter ${label}`}
                    {...props}
                />
            );
        }

        return (
            <input
                type={type ?? 'text'}
                name={name}
                id={name}
                className={inputClassName}
                placeholder={placeholder || `Enter ${label}`}
                defaultValue={type === 'file' ? undefined : props.defaultValue}
                value={value}
                {...props}
            />
        );
    };

    return (
        <div className={`${span ? 'md:col-span-2' : ''}`}>
            {label && (
                <label htmlFor={name} className="mb-0.5 block text-xs text-fg-muted md:text-sm 2xl:text-base">
                    {label ?? sentenceCase(name)} {props.required && '*'}
                </label>
            )}

            {InputEl()}
        </div>
    );
};

export default Input;
