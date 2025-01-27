import './SharePopup.scss';

import {FC, useState} from 'react';

import close from '../../../assets/images/close.png';
import Notification from '../Notification/Notification.tsx';

const SharePopup: FC<{ isExpanded: boolean }> = ({ isExpanded })  => {
    const [isVisible, setIsVisible] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const postLink = '/file/hOyzfy4IT5SHICtuMt9ee7/MyFeed-ui/...';

    const handleOpenPopup = () => {
        setIsVisible(true);
        if (typeof window !== 'undefined' && window.document) {
            window.document.body.classList.add('popup-open');
        }
    };

    const handleClosePopup = () => {
        setIsVisible(false);
        if (typeof window !== 'undefined' && window.document) {
            window.document.body.classList.remove('popup-open');
        }
        setNotification(null)
    };

    const handleCopyLink = async () => {
        setNotification(null);
        try {
            await window.navigator.clipboard.writeText(postLink);
            setNotification({message: 'Ссылка успешно скопирована!', type: 'success'});
        } catch (error) {
            console.error('Ошибка копирования ссылки:', error);
            setNotification({message: 'Не удалось скопировать ссылку.', type: 'error'});
        } finally {
            window.setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className="share">
            <button className="share__button-svg" onClick={handleOpenPopup}>
                <svg
                    className="share__icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7.21721 10.6571C6.83295 9.96691 6.096 9.5 5.25 9.5C4.00736 9.5 3 10.5074 3 11.75C3 12.9926 4.00736 14 5.25 14C6.096 14 6.83295 13.5331 7.21721 12.8429M7.21721 10.6571C7.39737 10.9807 7.5 11.3534 7.5 11.75C7.5 12.1466 7.39737 12.5193 7.21721 12.8429M7.21721 10.6571L16.7828 5.3429M7.21721 12.8429L16.7828 18.1571M16.7828 18.1571C16.6026 18.4807 16.5 18.8534 16.5 19.25C16.5 20.4926 17.5074 21.5 18.75 21.5C19.9926 21.5 21 20.4926 21 19.25C21 18.0074 19.9926 17 18.75 17C17.904 17 17.1671 17.4669 16.7828 18.1571ZM16.7828 5.3429C17.1671 6.03309 17.904 6.5 18.75 6.5C19.9926 6.5 21 5.49264 21 4.25C21 3.00736 19.9926 2 18.75 2C17.5074 2 16.5 3.00736 16.5 4.25C16.5 4.64664 16.6026 5.01931 16.7828 5.3429Z"
                        className="share__icon-path"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isVisible && <div className="popup-overlay" onClick={handleClosePopup}></div>}

            {isVisible && (
                <div className={`share__popup ${isExpanded ? 'share__popup--expanded' : ''}`}>
                    <button className="share__close-button" onClick={handleClosePopup}>
                        <img className="share__close-button-img" src={close} alt="close"/>
                    </button>
                    <h3 className="share__title">Поделиться этим постом</h3>
                    <h4 className="share__description">Ссылка</h4>
                    <input className="share__link" type="text" value={postLink} readOnly/>
                    <button className="share__copy-button" onClick={handleCopyLink}>Скопировать ссылку</button>
                </div>
            )}

            {notification && (
                <div className={`share__notification ${isExpanded ? 'share__notification--expanded' : ''}`}>
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => {
                            handleClosePopup();
                            setNotification(null)
                        }}
                    />
                </div>
            )
            }
        </div>
    );
};

export default SharePopup;
