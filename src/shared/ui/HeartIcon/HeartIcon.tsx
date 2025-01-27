import React, { useState } from 'react';

interface HeartIconProps {
    onClick?: () => void;
    isActive?: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({ onClick, isActive = false }) => {
    const [liked, setLiked] = useState(isActive);

    const handleClick = () => {
        setLiked(!liked);
        if (onClick) onClick();
    };

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={liked ? '#F03E3E' : 'none'}
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClick}
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease, transform 0.1s ease' }}
        >
            <path
                d="M11.395 20.9107L11.3884 20.9072L11.3658 20.8949C11.3465 20.8844 11.3189 20.8693 11.2836 20.8496C11.2129 20.8101 11.1112 20.7524 10.983 20.6769C10.7265 20.5261 10.3632 20.3039 9.92855 20.015C9.06074 19.4381 7.90122 18.5901 6.7386 17.5063C4.43781 15.3615 2 12.1751 2 8.25C2 5.32194 4.4636 3 7.4375 3C9.18638 3 10.7523 3.79909 11.75 5.0516C12.7477 3.79909 14.3136 3 16.0625 3C19.0364 3 21.5 5.32194 21.5 8.25C21.5 12.1751 19.0622 15.3615 16.7614 17.5063C15.5988 18.5901 14.4393 19.4381 13.5715 20.015C13.1368 20.3039 12.7735 20.5261 12.517 20.6769C12.3888 20.7524 12.2871 20.8101 12.2164 20.8496C12.1811 20.8693 12.1535 20.8844 12.1342 20.8949L12.1116 20.9072L12.105 20.9107L12.1023 20.9121C11.8823 21.0289 11.6177 21.0289 11.3977 20.9121L11.395 20.9107Z"
                fill={liked ? '#F03E3E' : 'none'}
                stroke={liked ? '#F03E3E' : '#BDBDBD'}
                strokeWidth="1.5"
            />
        </svg>
    );
};

export default HeartIcon;
