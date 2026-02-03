import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, className = '', id, rows = 3, ...props }, ref) => {
        const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

        return (
            <div>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    className={`w-full p-2 border rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none transition-colors resize-y ${error ? 'border-red-300' : 'border-gray-300'
                        } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';
