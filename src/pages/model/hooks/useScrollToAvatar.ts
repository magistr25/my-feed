import { useEffect } from "react";

export const useScrollToAvatar = (avatarRef: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
        if (avatarRef.current) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    avatarRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                });
            }, 100);
        }
    }, []);
};
