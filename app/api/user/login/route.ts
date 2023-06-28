import db from "@/db/models";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log(body)
    
        if (!body.email || !body.password) return new NextResponse(null, { status: 401, statusText: "Bad request" });
    
        const userData = await db.User.findOne({ where: { email: body.email }});

        if (!userData) 
            return new NextResponse(null, { status: 401, statusText: "Invalid email or password" });
            
        if (compareSync(body.password, userData.password)) {
            return new NextResponse(JSON.stringify(userData), { status: 200 });
        }
        
        return new NextResponse(null, { status: 401, statusText: "Invalid email or password" });
    } catch (err) {
        console.error(err);
        return new NextResponse(null, { status: 500 });
    }
}