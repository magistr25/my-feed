import './SelectDropdown.scss';

import React, { useState } from 'react';

import arrow_down from '../../../assets/images/arrow_down.png';
import arrow_up from '../../../assets/images/arrow_up.png';

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
                        <img
                            className="select-dropdown__arrow"
                            src={isOpen ? arrow_up : arrow_down}
                            alt="Arrow Icon"
                        />
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
