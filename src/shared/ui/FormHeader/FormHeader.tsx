import './FormHeader.scss';

import { FC } from 'react';

import Logo from "@/shared/ui/Logo/Logo.tsx";

interface FormHeaderProps {
    title: string;
}

const FormHeader: FC<FormHeaderProps> = () => (

    <div className="login-container-header">
        <div className="login-container-header_top">
            <svg width="219" height="28" viewBox="0 0 219 28" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 -2H219C216.894 -1.39731 215.418 0.495246 215.345 2.68446L215.317 3.5618C215.317 17.0587 204.375 28 190.878 28H28.1217C14.6249 28 3.68349 17.0587 3.68349 3.5618L3.65455 2.68447C3.58233 0.49525 2.10586 -1.39731 0 -2Z"
                    fill="black"/>
            </svg>
        </div>
        <div className="login-container-header_bottom">
            <Logo/>
        </div>
    </div>
);

export default FormHeader;
