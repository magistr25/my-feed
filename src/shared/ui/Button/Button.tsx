import "./Button.scss";

import { FC, MouseEvent } from "react";

import Spinner from "@/shared/ui/Spinner/Spinner.tsx";

type ButtonVariant = "primary" | "secondary" | "flat";
type ButtonSize = "small" | "large";

interface ButtonProps {
    text: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    isDisabled?: boolean;
    type?: string;
    autoFocus?: boolean;
}

const Button: FC<ButtonProps> = ({ text, onClick, variant = "primary", size = "large", isLoading = false, isDisabled = false}) => {
    const buttonClasses = `button button--${variant} button--${size} ${
        isDisabled ? "button--disabled" : ""
    } ${isLoading ? "button--loading" : ""}`;

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={isDisabled || isLoading}
        >
            {isLoading ? <Spinner /> : text}
        </button>
    );
};

export default Button;
