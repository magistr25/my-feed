import React from 'react';

const AnimatedAvatar: React.FC = () => {
    return (
        <svg width="209" height="44" viewBox="0 0 209 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="22" r="18.6262" fill="url(#paint0_linear)" stroke="url(#paint1_linear)" strokeWidth="0.747541"/>
            <rect x="176.5" y="10.5" width="23" height="23" fill="url(#paint2_linear)" stroke="url(#paint3_linear)"/>
            <rect x="51" y="12" width="123" height="14" rx="7" fill="url(#paint6_linear)"/>
            <defs>
                <linearGradient id="paint0_linear" x1="47" y1="22.3333" x2="9" y2="22.3333" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="47" y1="22.3333" x2="9" y2="22.3333" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="200" y1="22.2105" x2="176" y2="22.2105" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
                <linearGradient id="paint3_linear" x1="200" y1="22.2105" x2="176" y2="22.2105" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
                <linearGradient id="paint4_linear" x1="193" y1="22.0526" x2="183" y2="22.0526" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
                <linearGradient id="paint5_linear" x1="193" y1="22.0526" x2="183" y2="22.0526" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
                <linearGradient id="paint6_linear" x1="174" y1="19.1228" x2="51" y2="19.1228" gradientUnits="userSpaceOnUse">
                    <stop offset="5%">
                        <animate attributeName="stop-color" values="#DBDBDB;#000000;#DBDBDB" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%">
                        <animate attributeName="stop-color" values="#FFFFFF;#DBDBDB;#FFFFFF" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>
            </defs>
        </svg>

    );
};

export default AnimatedAvatar;
