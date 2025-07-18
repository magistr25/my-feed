import './StatusIcons.scss';

import React from 'react';

interface IconProps {
    className?: string;
}

export const SuccessIcon: React.FC<IconProps> = ({className = ''}) => (
    <svg
        className={`status-icon success-icon ${className}`}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >

        <circle cx="12" cy="12" r="10" fill="var(--success-color)"/>

        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.3603 9.93593C15.6011 9.59887 15.523 9.13046 15.1859 8.8897C14.8489 8.64894 14.3805 8.72701 14.1397 9.06407L10.9043 13.5936L9.28033 11.9697C8.98744 11.6768 8.51256 11.6768 8.21967 11.9697C7.92678 12.2626 7.92678 12.7374 8.21967 13.0303L10.4697 15.2803C10.6256 15.4362 10.8421 15.5156 11.0619 15.4974C11.2816 15.4793 11.4822 15.3653 11.6103 15.1859L15.3603 9.93593Z"
            fill="#FFFFFF"

        />
    </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({className = ''}) => (
    <svg
        className={`status-icon error-icon ${className}`}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="10" fill="var(--error-color)"/>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0303 8.96967C9.73744 8.67678 9.26256 8.67678 8.96967 8.96967C8.67678 9.26256 8.67678 9.73744 8.96967 10.0303L10.6893 11.75L8.96967 13.4697C8.67678 13.7626 8.67678 14.2374 8.96967 14.5303C9.26256 14.8232 9.73744 14.8232 10.0303 14.5303L11.75 12.8107L13.4697 14.5303C13.7626 14.8232 14.2374 14.8232 14.5303 14.5303C14.8232 14.2374 14.8232 13.7626 14.5303 13.4697L12.8107 11.75L14.5303 10.0303C14.8232 9.73744 14.8232 9.26256 14.5303 8.96967C14.2374 8.67678 13.7626 8.67678 13.4697 8.96967L11.75 10.6893L10.0303 8.96967Z"
            fill="#FFFFFF"

        />
    </svg>
);
