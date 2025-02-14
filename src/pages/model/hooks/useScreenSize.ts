import { useState, useEffect } from "react";

export const useScreenSize = () => {
    const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 1024);
            setIsDesktop(width >= 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { isDesktop, isMobile };
};
