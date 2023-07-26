export const genreMap = {
	28: 'Action',
	12: 'Adventure',
	16: 'Animation',
	35: 'Comedy',
	80: 'Crime',
	18: 'Drama',
	10751: 'Family',
	14: 'Fantasy',
	36: 'History',
	27: 'Horror',
	10402: 'Music',
	9648: 'Mystery',
	10749: 'Romance',
	878: 'Science Fiction',
	10770: 'TV Movie',
	53: 'Thriller',
	10752: 'War',
	37: 'Western'
};

export const streamingServicesMap: Record<string, number> = {
	"Netflix": 8,
	"Amazon Prime Video": 9,
	"Disney Plus": 337
}

export function getImagePath(slug: string, size: "original" | "w500") {
    return `https://image.tmdb.org/t/p/${size}${slug}`;
}