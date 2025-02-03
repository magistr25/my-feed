import axios from "axios";

const SERVER_URL = "https://internship-social-media.purrweb.com";

export const uploadToS3 = async (file: File): Promise<string> => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Не авторизован");

        const fileName = encodeURIComponent(file.name);
        console.log("📤 Запрашиваем signed URL для файла:", fileName);

        // 1️⃣ Получаем **signedUrl** (строка)
        const { data: signedUrl } = await axios.get<string>(`${SERVER_URL}/v1/aws/signed-url`, {
            params: { fileName, fileCategory: "AVATARS" },
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!signedUrl) {
            throw new Error("Сервер не вернул ссылку");
        }

        console.log("🔗 Полученная signed URL:", signedUrl);

        // 2️⃣ Загружаем файл на **S3**
        await axios.put(signedUrl, file, {
            headers: { "Content-Type": file.type },
        });

        // 3️⃣ Убираем `query-параметры` из ссылки
        const cleanUrl = signedUrl.split("?")[0];

        console.log("✅ Чистый URL для сохранения:", cleanUrl);
        return cleanUrl;
    } catch (error) {
        console.error("Ошибка загрузки файла на S3:", error);
        throw error;
    }
};

