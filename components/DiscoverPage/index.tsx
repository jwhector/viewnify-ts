"use client";

import { tmdbEntry } from "@/types/typedefs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Card from "../Cards/Card";
import { getImagePath } from "@/lib/utils/tmdbPaths";
import Swipeable from "../Cards/Swipeable";
import { classNames } from "@/lib/utils/tailwind";

async function getEntries(curPg: number) {
    const res = await fetch("http://localhost:3000/api/tmdb/getEntries", {
        method: "POST",
        body: JSON.stringify({ format: "movie", curPg })
    });

    return res.json() as Promise<tmdbEntry[]>;
}

export default function DiscoverPage() {
    const [curPg, setCurPg] = useState(1);
    const [entries, setEntries] = useState([] as tmdbEntry[]);
    const [bgImg, setBgImg] = useState("");
    const [cardIdx, setCardIdx] = useState(0);

    useEffect(() => {
        getEntries(curPg).then(res => {
            setEntries(res);
        }).catch(err => console.error(err));
    }, [curPg]);

    useEffect(() => {
        console.log(entries);
        // TODO: include total pages
        // if (!entries.length && curPg < entries.pages) {
        //     setCurPg(curPg + 1);
        //     return;
        // }
        if (entries.length) {
            setBgImg(`https://image.tmdb.org/t/p/original${entries[0].poster_path}`);
        }
    }, [entries, curPg]);

    function increment() {
        setCardIdx(cardIdx + 1);
    }

    console.log(cardIdx);
    

    return (
        <div className="flex relative h-full items-center justify-center overflow-hidden">
            <div className={classNames("absolute", cardIdx % 2 ? "z-20" : "")}>
            <Swipeable onExitLeft={increment} onExitRight={increment}>
                <Card imageSlug={(cardIdx % 2 ? entries[cardIdx] : entries[cardIdx + 1])?.poster_path} description="" backdropSlug={(cardIdx % 2 ? entries[cardIdx] : entries[cardIdx + 1])?.backdrop_path} />
            </Swipeable>
            </div>
            <div className={classNames("absolute", cardIdx % 2 ? "" : "z-20")}>
            <Swipeable onExitLeft={increment} onExitRight={increment}>
                <Card imageSlug={(cardIdx % 2 ? entries[cardIdx + 1] : entries[cardIdx])?.poster_path} description="" backdropSlug={(cardIdx % 2 ? entries[cardIdx + 1] : entries[cardIdx])?.backdrop_path} />
            </Swipeable>
            </div>
        </div>
    );
}