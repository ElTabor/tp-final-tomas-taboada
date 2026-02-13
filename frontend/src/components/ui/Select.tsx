import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    icon?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = 'Search or select...',
    required,
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(o => o.value === value);

    // Synchronize search text with selected value when not focused
    useEffect(() => {
        if (!isFocused) {
            setSearch(selectedOption ? selectedOption.label : '');
        }
    }, [value, selectedOption, isFocused]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleInputFocus = () => {
        setIsOpen(true);
        setIsFocused(true);
        // Clear search to show all options on click if desired, 
        // or keep it to show current selection
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setIsOpen(true);
        if (e.target.value === '') {
            onChange(''); // Clear selection if user clears input
        }
    };

    return (
        <div className={`w-full relative ${isOpen ? 'z-50' : 'z-0'}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative group">
                {icon && (
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none group-focus-within:text-primary transition-colors">
                        {icon}
                    </span>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    className={`block w-full ${icon ? 'pl-11' : 'pl-4'} pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none cursor-text font-medium`}
                    placeholder={placeholder}
                    value={search}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    required={required && !value}
                />
                <span
                    className={`material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform cursor-pointer pointer-events-none ${isOpen ? 'rotate-180' : ''}`}
                >
                    expand_more
                </span>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-400 italic">
                                No matching results for "{search}"
                            </div>
                        ) : (
                            filteredOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${option.value === value ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setSearch(option.label);
                                        setIsOpen(false);
                                        setIsFocused(false);
                                    }}
                                >
                                    {option.label}
                                    {option.value === value && <span className="material-icons text-sm">check</span>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
