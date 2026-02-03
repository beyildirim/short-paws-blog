import { forwardRef, type SelectHTMLAttributes } from 'react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, error, options, className = '', id, ...props }, ref) => {
        const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

        return (
            <div>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`w-full p-2 border rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none transition-colors bg-white ${error ? 'border-red-300' : 'border-gray-300'
                        } ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

FormSelect.displayName = 'FormSelect';
