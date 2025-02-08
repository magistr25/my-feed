import {ChangeEvent, useState} from "react";
import { imageVar } from "@/app/apollo/client";

const useFileUpload = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Отображаемое изображение

    const handleFileUpload = async (input: ChangeEvent<HTMLInputElement> | File) => {
        let file: File | null = null;

        if (input instanceof File) {
            file = input;
        } else if (input.target.files) {
            file = input.target.files[0];
        }

        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setPreviewUrl(null); // Пока грузится - не показываем фото

        let progress = 0;
        await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsUploading(false);
                        setPreviewUrl(URL.createObjectURL(file));
                        imageVar(file);
                        resolve();
                    }, 500);
                }
            }, 300);
        });
    };


    return { uploadProgress, isUploading, handleFileUpload, previewUrl };
};

export default useFileUpload;
