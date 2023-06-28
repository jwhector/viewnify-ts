export function getImagePath(slug: string, size: "original" | "w500") {
    return `https://image.tmdb.org/t/p/${size}${slug}`;
}