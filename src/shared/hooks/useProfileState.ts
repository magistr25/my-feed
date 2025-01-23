import { useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';

import { isInProfileVar } from '@/app/apollo/client';

// Хук для управления состоянием "в профиле"
const useProfileState = () => {
    // Получаем текущее состояние из Apollo Cache
    const isInProfile = useReactiveVar(isInProfileVar);

    // Синхронизация состояния с localStorage при монтировании компонента
    useEffect(() => {
        try {
            const storedState = localStorage.getItem('isInProfile');
            const initialState = storedState === 'true';
            isInProfileVar(initialState); // Устанавливаем начальное состояние в Apollo Cache
        } catch (error) {
            console.error('Ошибка чтения из localStorage:', error);
        }
    }, []);

    // Слушаем изменения реактивной переменной и обновляем localStorage
    useEffect(() => {
        const updateLocalStorage = (value: boolean) => {
            try {
                console.log('Обновление localStorage isInProfile:', value);
                localStorage.setItem('isInProfile', String(value));
            } catch (error) {
                console.error('Ошибка записи в localStorage:', error);
            }
        };

        const unsubscribe = isInProfileVar.onNextChange(updateLocalStorage);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            isInProfileVar(false); // Сбрасываем состояние профиля
        }
    }, []);

    // Методы для изменения состояния
    const enterProfile = () => isInProfileVar(true);
    const leaveProfile = () => isInProfileVar(false);

    return { isInProfile, enterProfile, leaveProfile };
};

export default useProfileState;
