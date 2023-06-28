import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/models";
import { Like } from "@/types/typedefs";
import type { tmdbResponse } from "@/types/typedefs";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        
        if (!body.format || !body.curPg) {
            return NextResponse.json({ message: "Body missing format and/or curPg" }, { status: 401 });
        }
    
        if (!session || !session.user) {
            const entries = await tmdbSearch({ format: body.format, genres: body.genres ?? "", streamingServices: body.services ?? "", curPg: body.curPg });
            return NextResponse.json(entries);
        }

        const userData = await db.User.findOne({
            where: {
                id: session.user.id
            },
            attributes: ["genres", "services"],
            include: [db.User.associations.likes]
        });

        if (!userData) {
            throw new Error(`Missing user data for user with id ${session.user.id}`);
        }
    
        const entries = await tmdbSearch({ format: body.format, genres: userData.genres, streamingServices: userData.services, curPg: body.curPg });

        const filteredEntries = filterEntries(entries, userData.likes?.map(like => like.dataValues) || []);
        
        return NextResponse.json(filteredEntries);
    } catch (err) {
        console.error(err);
        return new NextResponse(null, { status: 500 });
    }
}

interface SearchProps {
    format: string;
    curPg: number;
    genres: string;
    streamingServices: string;
}

async function tmdbSearch({ format, genres, streamingServices, curPg }: SearchProps): Promise<tmdbResponse> {
    let genreSearchString = '';
    let providerSearchString = '';

    if (genres.length) {
        genreSearchString = `&with_genres=${genres.replace(",", "|")}`;
    }

    if (streamingServices) {
        providerSearchString = `&with_watch_providers=${streamingServices.replace(",", "|")}`;
    }

    const response = await fetch(`https://api.themoviedb.org/3/discover/${format}?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${curPg}${genreSearchString}${providerSearchString}&watch_region=US&with_watch_monetization_types=flatrate`);
    return response.json();
}

function filterEntries(entries: tmdbResponse, likes: Like[]) {
    const likesSet = new Set(likes.map((like) => parseInt(like.tmdbId)));

    const tmdbFiltered = [...(entries.results)].filter((tmdbResult) => !likesSet.has(tmdbResult.id) && tmdbResult.poster_path && tmdbResult.backdrop_path);

    return tmdbFiltered;
}