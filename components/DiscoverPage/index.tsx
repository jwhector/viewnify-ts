"use client";

import dynamic from "next/dynamic";
import Color from "color";
import { tmdbEntry } from "@/types/typedefs";
import { Dispatch, useRef, useEffect, useState } from "react";
import { getImagePath } from "@/lib/utils/tmdbPaths";
import { classNames } from "@/lib/utils/tailwind";
import { FastAverageColor } from "fast-average-color";

const DynamicCard = dynamic(() => import("../Cards/Card"), { ssr: false });
const DynamicSwipeable = dynamic(() => import("../Cards/Swipeable"), { ssr: false });


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
    const [bgColors, setBgColors] = useState(["black", "white"]);
    const [bgOpacity, setbgOpacity] = useState(1);
    const [cardIdx, setCardIdx] = useState(0);
    const [loadedCards, setLoadedCards] = useState({ 1: false, 2: false });

    const isEven = cardIdx % 2;


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

    function increment(cardNumber: 1 | 2) {
        console.log("setting loaded cards to: ", { ...loadedCards, [cardNumber]: false });
        
        setLoadedCards({ ...loadedCards, [cardNumber]: false })
        setbgOpacity(1.001);
        setCardIdx(cardIdx + 1);
    }

    function onSwipe({ deltaX }: { deltaX: number }) {
        console.log("deltaX: ", deltaX);
        setbgOpacity(1 - Math.abs(deltaX / (document.body.clientWidth / 2)));
    }
    
    console.log(bgOpacity)
    useEffect(() => {
        const fac = new FastAverageColor();
        const frontColorPromise = fac.getColorAsync(getImagePath((entries[cardIdx])?.poster_path || "", "w500"));
        const backColorPromise = fac.getColorAsync(getImagePath((entries[cardIdx + 1])?.poster_path || "", "w500"));
        setBgColors(prevColors => [prevColors[1], prevColors[1]]);
        Promise.all([frontColorPromise, backColorPromise])
            .then(([frontColor, backColor]) => {
                setBgColors([frontColor.rgba, backColor.rgba]);
            })
            .catch(err => console.log(err));
    }, [cardIdx, entries]);
    

    return (
        <div className="flex relative h-full items-center justify-center overflow-hidden">
            <div className={classNames("h-full w-full absolute left-0")} style={{ background: colorToGradient(bgColors[1]) }}/>
            <div className={classNames("h-full w-full absolute left-0", bgOpacity === 1 && "transition-opacity duration-300")} style={{ background: colorToGradient(bgColors[0]), opacity: bgOpacity }}/>
            {/* Even card */}
            <div className={classNames("absolute rounded-xl", isEven ? "z-30" : "z-20")}>
                <div className={classNames("h-full w-full absolute left-0 rounded-xl", bgOpacity === 1 && "transition-opacity duration-300")} style={{ boxShadow: `4px 4px 8px ${Color(bgColors[isEven ? 0 : 1]).negate().alpha(isEven ? bgOpacity : 1 - bgOpacity)}`, opacity: isEven ? bgOpacity : 1 - bgOpacity }}/>
                <DynamicSwipeable canSwipe={loadedCards[1]} onExitLeft={() => increment(1)} onExitRight={() => increment(1)} onSwipe={onSwipe}>
                    <DynamicCard imageSlug={(isEven ? entries[cardIdx] : entries[cardIdx + 1])?.poster_path} description="" backdropSlug={(isEven ? entries[cardIdx] : entries[cardIdx + 1])?.backdrop_path} onLoad={() => setLoadedCards({ ...loadedCards, 1: true })} />
                </DynamicSwipeable>
            </div>
            {/* Odd card */}
            <div className={classNames("absolute rounded-xl", isEven ? "z-20" : "z-30")}>
                <div className={classNames("h-full w-full absolute left-0 rounded-xl", bgOpacity === 1 && "transition-opacity duration-300")} style={{ boxShadow: `4px 4px 8px ${Color(bgColors[isEven ? 1 : 0]).negate().alpha(isEven ? 1 - bgOpacity : bgOpacity)}`, opacity: isEven ? 1 - bgOpacity : bgOpacity }}/>
            <DynamicSwipeable canSwipe={loadedCards[2]} onExitLeft={() => increment(2)} onExitRight={() => increment(2)} onSwipe={onSwipe}>
                <DynamicCard imageSlug={(isEven ? entries[cardIdx + 1] : entries[cardIdx])?.poster_path} description="" backdropSlug={(isEven ? entries[cardIdx + 1] : entries[cardIdx])?.backdrop_path} onLoad={() => setLoadedCards({ ...loadedCards, 2: true })} />
            </DynamicSwipeable>
            </div>
        </div>
    );
}

function colorToGradient(color: string) {
    return `radial-gradient(circle, ${color} 35%, rgba(0,0,0,1) 130%)`;
}