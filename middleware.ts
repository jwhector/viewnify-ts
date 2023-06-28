import { NextResponse } from "next/server";

export default async function middleware() {
    // try {
    //     const dbInitStatusRes = await fetch("http://localhost:3000/api/middleware/db/initialized");
    //     const dbInitStatus = (await dbInitStatusRes.json()).initialized;

    //     console.log(dbInitStatus);

    //     if (!dbInitStatus) return new NextResponse(JSON.stringify({ success: false, message: "db not initialized" }), { status: 500 });
    // } catch (err) {
    //     console.error(err);
    // }
}