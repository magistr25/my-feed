import { useEffect } from "react";

export const useAutoScroll = (isMobileActionBarOpen: boolean) => {
    useEffect(() => {
        const inputs = document.querySelectorAll("input, textarea");
        if (inputs.length > 0) {
            const lastInput = inputs[inputs.length - 1] as HTMLElement;

            if (isMobileActionBarOpen) {
                lastInput.style.marginBottom = "50px";
            } else {
                lastInput.style.marginBottom = "";
            }
        }
    }, [isMobileActionBarOpen]);
};
