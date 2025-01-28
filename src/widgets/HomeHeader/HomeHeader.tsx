import './HomeHeader.scss';

import { FC } from 'react';

import SelectDropdown from '@/shared/ui/SelectDropdown/SelectDropdown.tsx';

const options = [
    { value: 'NEW', label: 'Новые' },
    { value: 'TOP', label: 'Популярные' },
];

interface HomeHeaderProps {
    onSelect: (value: string) => void;
    isLoading?: boolean;
}

const HomeHeader: FC<HomeHeaderProps> = ({ onSelect }) => {
    return (
        <header className="homepage__header">
            <nav className="homepage__nav">
                <SelectDropdown options={options} onSelect={onSelect} defaultLabel="Новые" />
            </nav>
        </header>
    );
};

export default HomeHeader;
