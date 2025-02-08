import { FC, useEffect, useState } from "react";
import "./UploadProgressBar.scss";

interface UploadProgressBarProps {
    progress: number;
    isVisible: boolean;
}

const UploadProgressBar: FC<UploadProgressBarProps> = ({ progress, isVisible }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [displayedProgress, setDisplayedProgress] = useState(0);

    useEffect(() => {
        if (isVisible) {
            setAnimatedProgress(progress);
        } else {
            setAnimatedProgress(0);
            setDisplayedProgress(0);
        }
    }, [progress, isVisible]);

    useEffect(() => {
        if ([0, 30, 60, 100].includes(animatedProgress)) {
            setDisplayedProgress(animatedProgress);
        }
    }, [animatedProgress]);

    return (
        <div className={`upload-progress-container ${isVisible ? "visible" : ""}`}>
            {isVisible && <div className="upload-progress-text">{displayedProgress}%</div>}
            <div className={`upload-progress-bar ${isVisible ? "visible" : ""}`}>
                <div className="upload-progress-bar__fill" style={{ width: `${animatedProgress}%` }}></div>
            </div>
        </div>
    );
};

export default UploadProgressBar;
