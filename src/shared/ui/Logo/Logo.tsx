import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store/store";
import logoLight from "@/assets/images/logo.png";
import logoDark from "@/assets/images/logo_dark.png";

type LogoProps = {
    altText?: string;
    className?: string;
};

const Logo: React.FC<LogoProps> = ({ altText = "Logo", className = "" }) => {

    const theme = useSelector((state: RootState) => state.theme.theme);

    const logoSrc = (theme === "dark") ? logoDark : logoLight;

    return (
        <img
            src={logoSrc}
            alt={altText}
            className={`logo ${className}`}
            width="144"
            height="35"
        />
    );
};

export default Logo;

