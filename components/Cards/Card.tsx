import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Hammer from "hammerjs";
import { getImagePath } from "@/lib/utils/tmdbPaths";
import { classNames } from "@/lib/utils/tailwind";

interface Props {
    imageSlug?: string;
    description: string;
    backdropSlug?: string;
}

export default function Card({ imageSlug, description, backdropSlug }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [curPg, setCurPg] = useState(1);

    const handleTap = useCallback(() => {
        const cardElement = cardRef.current;
        if (!cardElement) return;
        const hammertime = new Hammer(cardElement);

        hammertime.on("tap", function(e) {
            const isTap = getCursorPosition(cardElement, e);
            if (!isTap) return;

            const isLeftClick = isTap === "left";

            console.log("setting page", " curPg ", curPg, "isleft", isLeftClick);
            if (isLeftClick && curPg !== 1) setCurPg(curPg - 1);
            else if (!isLeftClick && curPg !== 3) setCurPg(curPg + 1);
        });
    }, [curPg]);

    useEffect(() => {
        const cardElement = cardRef.current;
        if (!cardElement) return;
        let hammertime = new Hammer(cardElement);

        hammertime.on("tap", function(e) {
            const isTap = getCursorPosition(cardElement, e);
            if (!isTap) return;

            const isLeftClick = isTap === "left";
            if (isLeftClick && curPg !== 1) setCurPg(curPg - 1);
            else if (!isLeftClick && curPg !== 3) setCurPg(curPg + 1);
        });
        return () => hammertime.off("tap");
    }, [curPg])    

    function getCursorPosition(el: HTMLElement, event: HammerInput) {
		const rect = el.getBoundingClientRect();
		const x = event.center.x - rect.left;
		if (x < rect.width / 3) {
			return "left";
		} else if (x > rect.width - rect.width / 3) {
			return "right";
		}
        return false;
	}

    return (
        <div ref={cardRef} className="h-[600px] w-96 flex transition-all ease-in-out rounded-xl overflow-hidden relative">
            <div className={classNames("absolute left-0 z-10 flex w-1/3 h-full bg-gradient-fade-left opacity-0 transition-opacity duration-300", curPg !== 1 && "hover:opacity-30")} />
            <div className={classNames("absolute right-0 z-10 flex w-1/3 h-full bg-gradient-fade-right opacity-0 transition-opacity duration-300", curPg !== 3 && "hover:opacity-30")} />
            <div className="flex w-full h-full absolute" style={{ visibility: curPg === 1 ? "visible" : "hidden"}}>
                { imageSlug && <Image src={getImagePath(imageSlug, "original")} alt={description} fill draggable={false} /> }
            </div>
            <div className="flex flex-col w-full h-full absolute" style={{ visibility: curPg === 2 ? "visible" : "hidden"}}>
                <div className="h-1/3 w-full relative">
                    <div className="bg-black opacity-60 z-20 absolute w-full h-full hover:opacity-0 transition-opacity duration-100" />
                    { backdropSlug && <Image src={getImagePath(backdropSlug, "original")} alt="" fill objectFit="cover" /> }
                </div>
                <div className="flex">
                    {description}
                </div>
            </div>
        </div>
    );
}