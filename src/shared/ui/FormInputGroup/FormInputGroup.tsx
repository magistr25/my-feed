import './FormInputGroup.scss';

import { FC } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputGroupProps {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    register: UseFormRegisterReturn;
    error?: string;
}

const FormInputGroup: FC<FormInputGroupProps> = ({ label, id, type, placeholder, register, error }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} placeholder={placeholder} {...register} className={error ? 'input-error' : ''} />
        {error && <span className="error-message">{error}</span>}
    </div>
);

export default FormInputGroup;
