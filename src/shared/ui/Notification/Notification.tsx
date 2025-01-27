import './Notification.scss';

import { FC } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/app/store/store';
import {ErrorIcon, SuccessIcon} from "@/shared/ui/StatusIcons/StatusIcons.tsx";

import closeIcon from '../../../assets/images/close.png';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ message, type, onClose }) => {
    // Получаем текущую тему из Redux
    const theme = useSelector((state: RootState) => state.theme.theme);

    // Выбор иконки в зависимости от типа уведомления
    const IconComponent = type === 'success' ? SuccessIcon : ErrorIcon;

    return (
        <div className={`notification notification--${type}`}>
            {/* Рендерим нужную иконку */}
            <IconComponent className={`notification__icon notification__icon--${theme}`} />

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

