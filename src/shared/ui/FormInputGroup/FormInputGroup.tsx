import './FormInputGroup.scss';

import { FC, ReactNode, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { ErrorIcon, SuccessIcon } from '@/shared/ui/StatusIcons/StatusIcons.tsx';

interface FormInputGroupProps {
    label: string;
    id: string;
    type: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: string;
    statusIcon?: boolean | null;
    autoComplete?: string;
    isIconVisible?: boolean;
    isPassword?: boolean;
    isPasswordVisible?: boolean;
    onTogglePasswordVisibility?: () => void;
    inputValue?: string;
    children?: ReactNode;
    className?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    inputMode?: string;
    pattern?: string;
    leftIcon?: ReactNode;
    defaultValue?: string;
}

const FormInputGroup: FC<FormInputGroupProps> = ({
                                                     label,
                                                     id,
                                                     type,
                                                     placeholder,
                                                     register,
                                                     error,
                                                     statusIcon,
                                                     autoComplete,
                                                     isIconVisible,
                                                     isPassword,
                                                     isPasswordVisible,
                                                     onTogglePasswordVisibility,
                                                     className,
                                                     inputValue,
                                                     leftIcon,
                                                     defaultValue
                                                 }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <div className="input-wrapper">
                {leftIcon && <span className="form-input-group__icon">{leftIcon}</span>}
                <input
                    id={id}
                    type={isPassword && isPasswordVisible ? 'text' : type}
                    placeholder={placeholder}
                    {...register}
                    defaultValue={defaultValue}
                    autoComplete={autoComplete}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`input-field ${className ? className : ''} ${isFocused ? 'input-focused' : ''} ${
                        error ? 'input-error' : ''
                    }`}
                />
                {/* Иконка управления видимостью пароля */}
                {isPassword && inputValue && (
                    <span className={`password-icon ${error ? 'error-icon' : ''}`} onClick={onTogglePasswordVisibility}>
                        {isPasswordVisible ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.05186 12.8224C1.98278 12.6151 1.98271 12.3907 2.05167 12.1834C3.44004 8.00972 7.3771 5 12.0171 5C16.655 5 20.5905 8.00692 21.9806 12.1776C22.0497 12.3849 22.0498 12.6093 21.9808 12.8166C20.5925 16.9903 16.6554 20 12.0154 20C7.37751 20 3.44195 16.9931 2.05186 12.8224Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15.0163 12.5C15.0163 14.1569 13.6732 15.5 12.0163 15.5C10.3595 15.5 9.01631 14.1569 9.01631 12.5C9.01631 10.8431 10.3595 9.5 12.0163 9.5C13.6732 9.5 15.0163 10.8431 15.0163 12.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.04557 8.22257C3.12247 9.31382 2.41806 10.596 2 12.0015C3.2913 16.338 7.30875 19.5 12.0647 19.5C13.0573 19.5 14.0177 19.3623 14.9279 19.1049M6.29327 6.22763C7.94953 5.13558 9.93335 4.5 12.0656 4.5C16.8216 4.5 20.8391 7.66205 22.1304 11.9985C21.4185 14.3919 19.8762 16.4277 17.8376 17.772M6.29327 6.22763L3.06564 3M6.29327 6.22763L9.94432 9.87868M17.8376 17.772L21.0656 21M17.8376 17.772L14.187 14.1213M14.187 14.1213C14.7299 13.5784 15.0656 12.8284 15.0656 12C15.0656 10.3431 13.7225 9 12.0656 9C11.2372 9 10.4872 9.33579 9.94432 9.87868M14.187 14.1213L9.94432 9.87868"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </span>
                )}
                {/* Иконка успешности или ошибки */}
                {isIconVisible && statusIcon === true && <SuccessIcon className="status-icon success-icon" />}
                {isIconVisible && statusIcon === false && <ErrorIcon className="status-icon error-icon" />}
                {/* Сообщение об ошибке */}
                {error && <span className="error-message">{error}</span>}
            </div>
        </div>
    );
};

export default FormInputGroup;


