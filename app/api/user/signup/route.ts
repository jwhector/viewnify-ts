import { User } from "@/db/models";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt";

type SignupRequest = {
    email: string;
    password: string;
    genres: string;
    services: string;
    cachedLikes: string[];
    cachedDislikes: string[];
}

export async function POST(req: NextRequest, res: NextResponse) {
    if (!req.body) return new NextResponse(null, { status: 400, statusText: "Bad request" });

    try {
        const json: SignupRequest = await req.json();

        const userData = await User.create({
            password: json.password,
            email: json.email,
            genres: json.genres,
            services: json.services,
        });

        if (!userData || !json.password)  {
            return new NextResponse(null, { status: 401, statusText: "Invalid email or password" });
        }
        if (compareSync(json.password, userData.password)) {
            return NextResponse.json(userData);
        }
        return new NextResponse(null, { status: 401, statusText: "Invalid email or password" });
    
    } catch (e) {
        console.log(e);
        return new NextResponse(null, { status: 400, statusText: "Bad request" });
    }
}