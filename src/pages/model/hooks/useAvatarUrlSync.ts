import { useEffect } from "react";
import { avatarUrlVar } from "@/app/apollo/client.ts";

export const useAvatarUrlSync = (data: any) => {
    useEffect(() => {
        avatarUrlVar(data?.userMe?.avatarUrl ?? null);
    }, [data]);
};
