import {FC} from "react";
import { useSelector } from 'react-redux';

import { selectTheme } from '@/app/store/ducks/theme';
import default_avatar from '@/assets/images/default_avatar.png';
import default_avatar_dark from '@/assets/images/default_avatar_dark.png';

const DefaultAvatar: FC = () => {

    const currentTheme = useSelector(selectTheme);

    const avatarSrc = currentTheme === 'dark' ? default_avatar_dark : default_avatar;

    return (
        <img
            src={avatarSrc}
            alt="Default avatar"
            width="40"
            height="40"
            style={{ borderRadius: '50%' }}
        />
    );
};

export default DefaultAvatar;
