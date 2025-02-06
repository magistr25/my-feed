import { uploadToS3 } from "@/shared/utils/uploadToS3.ts";
import { postFileVar, postUrlVar } from "@/app/apollo/client.ts";

class PostUtils {
    constructor() {
        this.handlePostFileChange = this.handlePostFileChange.bind(this);
    }

    handlePostFileChange(file: File) {
        postFileVar(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            postUrlVar(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async uploadImageAndGetUrl(file: File): Promise<string> {
        try {
            const mediaUrl = await uploadToS3(file);
            if (!mediaUrl) throw new Error("Ошибка загрузки файла");
            return mediaUrl;
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
            throw error;
        }
    }
}

export default new PostUtils();
