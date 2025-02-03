import { useState } from 'react';

export const useAvatarError = () => {
    const [avatarError, setAvatarError] = useState(false);

    return { avatarError, setAvatarError };
};
