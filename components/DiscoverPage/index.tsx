"use client";

import dynamic from "next/dynamic";
import Color from "color";
import { LocalLike, tmdbEntry, tmdbResponse } from "@/types/typedefs";
import { Dispatch, useRef, useEffect, useState } from "react";
import { getImagePath, streamingServicesMap } from "@/lib/utils/tmdbUtils";
import { classNames } from "@/lib/utils/tailwind";
import { FastAverageColor } from "fast-average-color";
import useLocalStorage from "../Hooks/useLocalStorage";
import { useSession } from "next-auth/react";

const DynamicCard = dynamic(() => import("../Cards/Card"), { ssr: false });
const DynamicSwipeable = dynamic(() => import("../Cards/Swipeable"), {
  ssr: false,
});

async function getEntries(curPg: number, likes?: LocalLike[], dislikes?: LocalLike[]) {
  const res = await fetch("http://localhost:3000/api/tmdb/getEntries", {
    method: "POST",
    body: JSON.stringify({ format: "movie", curPg, services: ["Netflix", "Amazon Prime Video"].map(provider => streamingServicesMap[provider]).join(","), likes, dislikes }),
  });

  return res.json() as Promise<tmdbResponse>;
}

export default function DiscoverPage() {
  const session = useSession();

  const [curPg, setCurPg] = useState(1);
  const [entries, setEntries] = useState<tmdbResponse | undefined>();
  const [bgColors, setBgColors] = useState(["black", "white"]);
  const [bgOpacity, setbgOpacity] = useState(1);
  const [cardIdx, setCardIdx] = useState(0);
  const [cardALoaded, setCardALoaded] = useState(false);
  const [cardBLoaded, setCardBLoaded] = useState(false);

  const cardAImg = useRef<HTMLImageElement | null>(null);
  const cardBImg = useRef<HTMLImageElement | null>(null);

  const [localLikes, setLocalLikes] = useLocalStorage("likes");
  const [localDislikes, setLocalDislikes] = useLocalStorage("dislikes");

  const isEven = cardIdx % 2;

  useEffect(() => {
    getEntries(1, localLikes, localDislikes)
      .then((res) => {
        console.log(res);
        setEntries(prevEntries => {
            return {
            ...res, results: [...(prevEntries?.results || []), ...res.results] }
        }
            );
      })
      .catch((err) => console.error(err));
  }, [localDislikes, localLikes]);

  useEffect(() => {
    if (entries?.results && cardIdx > entries.results.length - 2 && curPg === entries?.page && curPg < entries.total_pages) {
        getEntries(curPg + 1)
        .then((res) => {
            setEntries(prevEntries => {
                return {
                ...res, results: [...(prevEntries?.results || []), ...res.results] }
            }
                );
        })
      .catch((err) => console.error(err));
        setCurPg(prevCurPg => prevCurPg + 1);
        return;
    }
  }, [entries, curPg, cardIdx]);

  function saveLike() {
    if (session.status === "authenticated") {
      // TODO: implement session behavior
    } else if (entries) {
      const likes: { tmdbId: string }[] = [...(localLikes as { tmdbId: string }[] ?? []), { tmdbId: `${entries.results[cardIdx].id}` }];
      setLocalLikes(likes);
      console.log("LIKES: ", likes);
    }
    increment();
  }

  function saveDislike() {
    if (session.status === "authenticated") {
      // TODO: implement session behavior
    } else if (entries) {
      const dislikes: { tmdbId: string }[] = [...(localDislikes as { tmdbId: string }[] ?? []), { tmdbId: `${entries.results[cardIdx].id}` }];
      setLocalDislikes(dislikes);
      console.log("DISLIKES: ", dislikes);
    }
    increment();
  }

  function increment() {
    if (isEven) {
      setCardALoaded(false);
    } else {
      setCardBLoaded(false);
    }

    setbgOpacity(1.001);
    setCardIdx(cardIdx + 1);
  }

  function onSwipe({ deltaX }: { deltaX: number }) {
    setbgOpacity(1 - Math.abs(deltaX / (document.body.clientWidth / 2)));
  }

  useEffect(() => {
    // if (!cardALoaded || !cardBLoaded) return;
    const fac = new FastAverageColor();

    const frontImg = isEven ? cardAImg.current : cardBImg.current;
    const backImg = isEven ? cardBImg.current : cardAImg.current;
    let frontColor: string = "rgb(0,0,0)";
    let backColor: string = "rgb(0,0,0)";

    if (frontImg) {
        frontColor = fac.getColor(isEven ? cardAImg.current : cardBImg.current).rgb;
    }

    if (backImg) {
        backColor = fac.getColor(isEven ? cardBImg.current : cardAImg.current).rgb;
    }

    setBgColors([frontColor, backColor]);
  }, [cardIdx, curPg, entries, isEven, cardALoaded, cardBLoaded]);

  return (
    <div className="flex relative h-full items-center justify-center overflow-hidden">
      <div
        className={classNames("h-full w-full absolute left-0")}
        style={{ background: colorToGradient(bgColors[1]) }}
      />
      <div
        className={classNames(
          "h-full w-full absolute left-0",
          bgOpacity === 1 && "transition-opacity duration-300"
        )}
        style={{ background: colorToGradient(bgColors[0]), opacity: bgOpacity }}
      />
      {/* Even card */}
      <div
        className={classNames("absolute rounded-xl", isEven ? "z-30" : "z-20")}
      >
        <div
          className={classNames(
            "h-full w-full absolute left-0 rounded-xl",
            bgOpacity === 1 && "transition-opacity duration-300"
          )}
          style={{
            boxShadow: `4px 4px 8px ${Color(bgColors[isEven ? 0 : 1])
              .negate()
              .alpha(isEven ? bgOpacity : 1 - bgOpacity)}`,
            opacity: isEven ? bgOpacity : 1 - bgOpacity,
          }}
        />
        <DynamicSwipeable
          canSwipe={cardALoaded}
          onExitLeft={saveDislike}
          onExitRight={saveLike}
          onSwipe={onSwipe}
        >
          <DynamicCard
            imageSlug={
              (isEven ? entries?.results[cardIdx] : entries?.results[cardIdx + 1])?.poster_path
            }
            description=""
            backdropSlug={
              (isEven ? entries?.results[cardIdx] : entries?.results[cardIdx + 1])?.backdrop_path
            }
            onLoad={(img) => {
                setCardALoaded(true);
                cardAImg.current = img;
            }}
          />
        </DynamicSwipeable>
      </div>
      {/* Odd card */}
      <div
        className={classNames("absolute rounded-xl", isEven ? "z-20" : "z-30")}
      >
        <div
          className={classNames(
            "h-full w-full absolute left-0 rounded-xl",
            bgOpacity === 1 && "transition-opacity duration-300"
          )}
          style={{
            boxShadow: `4px 4px 8px ${Color(bgColors[isEven ? 1 : 0])
              .negate()
              .alpha(isEven ? 1 - bgOpacity : bgOpacity)}`,
            opacity: isEven ? 1 - bgOpacity : bgOpacity,
          }}
        />
        <DynamicSwipeable
          canSwipe={cardBLoaded}
          onExitLeft={saveDislike}
          onExitRight={saveLike}
          onSwipe={onSwipe}
        >
          <DynamicCard
            imageSlug={
              (isEven ? entries?.results[cardIdx + 1] : entries?.results[cardIdx])?.poster_path
            }
            description=""
            backdropSlug={
              (isEven ? entries?.results[cardIdx + 1] : entries?.results[cardIdx])?.backdrop_path
            }
            onLoad={(img) => {
              setCardBLoaded(true);
              cardBImg.current = img;
            }}
          />
        </DynamicSwipeable>
      </div>
    </div>
  );
}

function colorToGradient(color: string) {
  return `radial-gradient(circle, ${color} 35%, rgba(0,0,0,1) 130%)`;
}
