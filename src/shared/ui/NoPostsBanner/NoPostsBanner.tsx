import "./NoPostsBanner.scss";

import React from "react";

import Button from "@/shared/ui/Button/Button.tsx";

interface NoPostsBannerProps {
    message: string;
    buttonText: string;
    onButtonClick: () => void;
    imageSrc: string;
}

const NoPostsBanner: React.FC<NoPostsBannerProps> = ({message, buttonText, onButtonClick, imageSrc}) => {
    return (
        <div className="no-posts-banner">
            <div className="no-posts-banner__content">
                <img src={imageSrc} alt="No posts illustration" className="no-posts-banner__image"/>
                <h2 className="no-posts-banner__message">{message}</h2>
                <Button text={buttonText} onClick={onButtonClick} variant="primary"  size="small"/>
            </div>
        </div>
    );
};

export default NoPostsBanner;

