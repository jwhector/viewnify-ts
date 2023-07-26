export type User = {
    id: string;
    password: string;
    email: string;
    genres?: string;
    streaming_service?: string;
    error?: string;
}

export interface LocalLike {
    tmdbId: string;
}

export interface Like {
    id: number;
    tmdbId: string;
    userId: number;
}

export interface tmdbResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: tmdbEntry[];
}

export interface tmdbEntry {
    adult: boolean;
    backdrop_path?: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title?: string;
    overview: string;
    popularity: number;
    poster_path?: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}