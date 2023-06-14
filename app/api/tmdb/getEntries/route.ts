import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, res: NextResponse) {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.JWT_SECRET, raw: true });

    if (!session || !token) {
        return NextResponse.json({ message: "User must be signed in!", status: 401 });
    }


    console.log("TOKEN: ", token);

    const entriesResponse = await fetch("http://localhost:3005/tmdbSearch", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({ format: "movie", curPg: 1 })
    });

    const entries = await entriesResponse.json();

    console.log("ENTRIES: ", entries);
}