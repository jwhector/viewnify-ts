export type User = {
    id: string;
    password: string;
    email: string;
    genres?: string;
    streaming_service?: string;
    error?: string;
}