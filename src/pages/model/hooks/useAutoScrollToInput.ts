import { useEffect } from "react";

export const useAutoScrollToInput = (isMobileActionBarOpen: boolean) => {
    useEffect(() => {
        if (isMobileActionBarOpen) {
            const activeElement = document.activeElement as HTMLElement;
            if (
                activeElement &&
                (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") &&
                activeElement.closest(".profile-wrapper-down")
            ) {
                setTimeout(() => {
                    activeElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        }
    }, [isMobileActionBarOpen]);
};
