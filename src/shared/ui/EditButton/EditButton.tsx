import './EditButton.scss';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditButtonProps {
    postId: string;
    title: string;
    description: string;
    image: string;
}

const EditButton: FC<EditButtonProps> = ({ postId, title, description, image }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        console.log("Передаём в редактирование пост ID:", postId);
        navigate(`/my-posts/redactions`, {
            state: { postId, title, description, image } // Передаём данные поста
        });
    };

    return (
        <button className="edit-button" onClick={handleEdit}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M16.8617 5.23667L18.5492 3.54917C19.2814 2.81694 20.4686 2.81694 21.2008 3.54917C21.9331 4.28141 21.9331 5.46859 21.2008 6.20083L10.5822 16.8195C10.0535 17.3481 9.40144 17.7368 8.68489 17.9502L6 18.75L6.79978 16.0651C7.01323 15.3486 7.40185 14.6965 7.93052 14.1678L16.8617 5.23667ZM16.8617 5.23667L19.5 7.87499"
                    stroke="#BDBDBD"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18 14.75V19.5C18 20.7426 16.9926 21.75 15.75 21.75H5.25C4.00736 21.75 3 20.7426 3 19.5V8.99999C3 7.75735 4.00736 6.74999 5.25 6.74999H10"
                    stroke="#BDBDBD"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export default EditButton;
