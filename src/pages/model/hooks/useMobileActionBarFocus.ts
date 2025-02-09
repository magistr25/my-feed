import { useEffect } from "react";
import { showActionBarVar } from "@/app/apollo/client.ts";

export const useMobileActionBarFocus = () => {
    useEffect(() => {
        const handleFocusIn = (event: FocusEvent) => {
            const target = event.target as HTMLElement;

            if (target?.matches("input, textarea")) {
                showActionBarVar(true); // Показываем MobileActionBar

                setTimeout(() => {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 200);
            }
        };

        document.addEventListener("focusin", handleFocusIn);
        return () => document.removeEventListener("focusin", handleFocusIn);
    }, []);
};
