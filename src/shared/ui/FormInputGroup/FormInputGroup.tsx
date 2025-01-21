import './FormInputGroup.scss';

import { FC } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { ErrorIcon, SuccessIcon } from '@/shared/ui/StatusIcons/StatusIcons.tsx';

interface FormInputGroupProps {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    register: UseFormRegisterReturn;
    error?: string;
    statusIcon?: boolean | null;
    autoComplete?: string;
    isIconVisible?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
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
          onFocus,
          onBlur,
   }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div className="input-wrapper">
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register}
                className={error ? 'input-error' : ''}
                autoComplete={autoComplete}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {isIconVisible && statusIcon === true && <SuccessIcon className="status-icon" />}
            {isIconVisible && statusIcon === false && <ErrorIcon className="status-icon" />}
            {error && <span className="error-message">{error}</span>}
        </div>

    </div>
);

export default FormInputGroup;
