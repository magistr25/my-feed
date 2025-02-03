export const formatDescription = (
    description: string,
    fullDescription: string | undefined,
    showFullPost: boolean,
    isLargeScreen: boolean
): string => {
    if (showFullPost) return fullDescription || description;

    if (isLargeScreen) {
        return description.length > 200
            ? `${description.slice(0, 177)}…`
            : description;
    }

    return `${description.slice(0, 65)}…`;
};
