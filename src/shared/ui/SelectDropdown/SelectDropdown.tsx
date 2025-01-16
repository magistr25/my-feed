import './SelectDropdown.scss';

import React, { useState } from 'react';

interface SelectDropdownProps {
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    defaultLabel?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, onSelect, defaultLabel = 'Новое' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(defaultLabel);

    const handleSelect = (value: string, label: string) => {
        setSelectedOption(label);
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="select">
            <div className="select-dropdown">
                <button
                    className="select-dropdown__button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="select-dropdown__button_inner">
                        {selectedOption}
                        {isOpen ? (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.7698 14.7906C16.4713 15.0777 15.9965 15.0684 15.7094 14.7698L12 10.8321L8.29062 14.7698C8.00353 15.0684 7.52875 15.0777 7.23017 14.7906C6.93159 14.5035 6.92228 14.0287 7.20937 13.7302L11.4594 9.23017C11.6008 9.08311 11.796 9 12 9C12.204 9 12.3992 9.08311 12.5406 9.23017L16.7906 13.7302C17.0777 14.0287 17.0684 14.5035 16.7698 14.7906Z"
                                    fill="var(--homepage-header-color)"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="25"
                                height="24"
                                viewBox="0 0 25 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.73017 9.20938C8.02875 8.92228 8.50353 8.93159 8.79063 9.23017L12.5 13.1679L16.2094 9.23017C16.4965 8.93159 16.9713 8.92228 17.2698 9.20938C17.5684 9.49647 17.5777 9.97125 17.2906 10.2698L13.0406 14.7698C12.8992 14.9169 12.704 15 12.5 15C12.296 15 12.1008 14.9169 11.9594 14.7698L7.70938 10.2698C7.42228 9.97125 7.43159 9.49647 7.73017 9.20938Z"
                                    fill="var(--homepage-header-color)"
                                />
                            </svg>
                        )}
                    </div>
                </button>
                {isOpen && (
                    <ul className="select-dropdown__list">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className={`select-dropdown__item ${selectedOption === option.label ? 'select-dropdown__item--active' : ''}`}
                                onClick={() => handleSelect(option.value, option.label)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SelectDropdown;
