import {DragEvent, ChangeEvent} from "react";

export class ImageService {
    static MAX_WIDTH = 663;
    static MAX_HEIGHT = 346;

     // Создает превью изображения, учитывая ограничения по размеру

    static generatePreview(file: File, callback: (previewUrl: string) => void): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                if (img.width > this.MAX_WIDTH || img.height > this.MAX_HEIGHT) {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    let width = img.width;
                    let height = img.height;
                    const ratio = Math.min(this.MAX_WIDTH / width, this.MAX_HEIGHT / height);
                    width *= ratio;
                    height *= ratio;

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);
                    callback(canvas.toDataURL("image/png"));
                } else {
                    callback(img.src);
                }
            };
        };
        reader.readAsDataURL(file);
    }

    //Обрабатывает файлы при Drag & Drop

    static handleDrop(event: DragEvent<HTMLDivElement>, callback: (file: File) => void): void {
        event.preventDefault();
        event.stopPropagation();

        if (!event.dataTransfer) {
            console.error("Ошибка: dataTransfer не доступен.");
            return;
        }

        let file: File | null = null;

        if (event.dataTransfer.files.length > 0) {
            file = event.dataTransfer.files[0];
        } else if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            const item = event.dataTransfer.items[0];
            if (item.kind === "file") {
                file = item.getAsFile();
            }
        }

        if (!file) {
            console.error("Ошибка: Файл не найден.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            console.error("Ошибка: Выбранный файл не является изображением.");
            return;
        }

        callback(file);
    }


    // Обрабатывает файлы, загруженные через input

    static handleFileChange(event: ChangeEvent<HTMLInputElement>, callback: (file: File) => void): void {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            if (file.type.startsWith("image/")) {
                callback(file);
            } else {
                console.error("Выбранный файл не является изображением.");
            }
        }
    }
}
