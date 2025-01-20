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
            />
            {isIconVisible && statusIcon === true && <SuccessIcon className="status-icon" />}
            {isIconVisible && statusIcon === false && <ErrorIcon className="status-icon" />}
        </div>
        {error && <span className="error-message">{error}</span>}
    </div>
);

export default FormInputGroup;
