import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getImagePath } from "@/lib/utils/tmdbPaths";
import { classNames } from "@/lib/utils/tailwind";
import { Triangle } from "react-loader-spinner";
import Hammer from "hammerjs";

interface Props {
    imageSlug?: string;
    description: string;
    backdropSlug?: string;
    onLoad?: () => void;
}

function Card({ imageSlug, description, backdropSlug, onLoad }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [curPg, setCurPg] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cardElement = cardRef.current;
            if (!cardElement || isLoading) return;
            let hammertime = new Hammer(cardElement);
    
            hammertime.on("tap", function(e) {
                const isTap = getCursorPosition(cardElement, e);
                if (!isTap) return;
    
                const isLeftClick = isTap === "left";
                if (isLeftClick && curPg !== 1) setCurPg(curPg - 1);
                else if (!isLeftClick && curPg !== 3) setCurPg(curPg + 1);
            });
            return () => hammertime.off("tap");
        }
    }, [curPg, isLoading]);
    
    useEffect(() => {
        setIsLoading(true);
       setCurPg(1);
    }, [imageSlug]);

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

    function onLoadingComplete() {
        setIsLoading(false);
        if (onLoad) onLoad();
    }

    return (
        <div ref={cardRef} className="h-[600px] w-96 flex transition-all ease-in-out rounded-xl overflow-hidden relative">
            {!isLoading && (
                <>
                <div className={classNames("absolute left-0 z-10 flex w-1/3 h-full bg-gradient-fade-left opacity-0 transition-opacity duration-300", curPg !== 1 && "hover:opacity-30")} />
                <div className={classNames("absolute right-0 z-10 flex w-1/3 h-full bg-gradient-fade-right opacity-0 transition-opacity duration-300", curPg !== 3 && "hover:opacity-30")} />
            </>
            )}
            <ImagePage imageSlug={imageSlug} visible={curPg === 1} onLoad={onLoadingComplete} />
            <DetailPage imageSlug={backdropSlug} visible={curPg === 2} />
        </div>
    );
}

function LoadingPage({ visible = false }) {
    return (
        <div className="flex w-full h-full z-10 absolute bg-black" style={{ visibility: visible ? "visible" : "hidden" }}>
            <Triangle color="rgba(226, 43, 255, 1)" height={200} width={200} wrapperClass="w-full flex items-center justify-center rotate-180" />
        </div>
    );
}

function ImagePage({ imageSlug, visible = true, onLoad }: { imageSlug?: string, visible: boolean, onLoad?: () => void }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imageSlug) setIsLoading(true);
    }, [imageSlug]);

    function onLoadingComplete() {
        setIsLoading(false);
        if (onLoad) onLoad();
    }

    return (
        <>
            <div className="flex w-full h-full absolute" style={{ visibility: visible ? "visible" : "hidden" }}>
            <LoadingPage visible={isLoading && visible} />
                    { imageSlug && <Image src={getImagePath(imageSlug, "original")} fill draggable="false" alt="" onLoadingComplete={onLoadingComplete} /> }
                </div>
        </>
    );
}

function DetailPage({ imageSlug, visible = true, onLoad }: { imageSlug?: string, visible: boolean, onLoad?: () => void }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imageSlug) setIsLoading(true);
    }, [imageSlug]);

    function onLoadingComplete() {
        setIsLoading(false);
        if (onLoad) onLoad();
    }

    return (
        <>
            <div className="flex flex-col w-full h-full absolute" style={{ visibility: visible ? "visible" : "hidden"}}>
                <div className="h-1/3 w-full relative">
                    <div className="bg-black opacity-60 z-20 absolute w-full h-full hover:opacity-0 transition-opacity duration-100" />
                    <LoadingPage visible={isLoading && visible} />
                    { imageSlug && <Image src={getImagePath(imageSlug, "original")} alt="" fill style={{ objectFit: "cover" }} onLoadingComplete={onLoadingComplete} /> }
                </div>
                {/* <div className="flex">
                    {description}
                </div> */}
            </div>
        </>
    );
}

export default Card;