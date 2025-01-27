import './Notification.scss';

import React from 'react';

import closeIcon from '../../../assets/images/close.png';
import errorIcon from '../../../assets/images/ErrorIcon.png';
import successIcon from '../../../assets/images/successIcon.png';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const iconSrc = type === 'success' ? successIcon : errorIcon;

    return (
        <div className={`notification notification--${type}`}>
            <img src={iconSrc} alt={type} className="notification__icon" />
            <span className="notification__message">{message}</span>
            <button
                className="notification__close-button"
                onClick={onClose}
            >
                <img src={closeIcon} alt="Close" className="notification__close-button-icon" />
            </button>
        </div>
    );
};

export default Notification;

