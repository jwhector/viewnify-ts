import Hammer from "hammerjs";
import { ReactNode, useCallback, useEffect, useRef } from "react";

interface Props {
  canSwipe?: boolean;
  onExitLeft?: () => void;
  onExitRight?: () => void;
  onSwipe?: ({
    deltaX,
    deltaY,
    rotate,
  }: {
    deltaX: number;
    deltaY: number;
    rotate: number;
  }) => void;
  children: any;
}

function Swipeable({
  canSwipe = true,
  onExitLeft,
  onExitRight,
  onSwipe,
  children,
}: Props) {
  const swipeableRef = useRef<HTMLDivElement>(null);
  const hammertimeRef = useRef<HammerManager | null>(null);

  const addSwipe = useCallback(() => {
    if (!hammertimeRef.current || !canSwipe) {
      return;
    }

    const hammertime = hammertimeRef.current;

    hammertime.on("pan", (e) => {
      if (e.deltaX === 0) return;
      if (e.center.x === 0 && e.center.y === 0) return;

      var xMulti = e.deltaX * 0.03;
      var yMulti = (e.deltaY + 100) / 80;
      var rotate = xMulti * yMulti;

      if (!swipeableRef.current) return;

      swipeableRef.current.style.transition = "none";
      swipeableRef.current.style.cursor = "grabbing";

      swipeableRef.current.style.transform =
        "translate(" +
        e.deltaX +
        "px, " +
        e.deltaY +
        "px) rotate(" +
        rotate +
        "deg)";

      if (onSwipe)
        onSwipe({ deltaX: e.deltaX, deltaY: e.deltaY, rotate: rotate });
    });

    hammertime.on("panend", (e) => {
      if (!swipeableRef.current) return;

      swipeableRef.current.style.removeProperty("transition");
      const moveOutWidth = document.body.clientWidth;
      const keep = Math.abs(e.deltaX) < 80 || Math.abs(e.velocityX) < 0.5;

      if (keep) {
        swipeableRef.current.style.transform = "";
        if (onSwipe) onSwipe({ deltaX: 0, deltaY: 0, rotate: 0 });
      } else {
        const endX = Math.max(
          Math.abs(e.velocityX) * moveOutWidth,
          moveOutWidth
        );
        const toX = e.deltaX > 0 ? endX : -endX;
        const endY = Math.abs(e.velocityY) * moveOutWidth;
        const toY = e.deltaY > 0 ? endY : -endY;
        const xMulti = e.deltaX * 0.03;
        const yMulti = e.deltaY / 80;
        const rotate = xMulti * yMulti;

        swipeableRef.current.style.transform =
          "translate(" +
          toX +
          "px, " +
          (toY + e.deltaY) +
          "px) rotate(" +
          rotate +
          "deg)";

        if (onSwipe) onSwipe({ deltaX: endX, deltaY: endY, rotate: 0 });

        swipeableRef.current.addEventListener(
          "transitionend",
          () => {
            if (e.deltaX > 0 && onExitRight) {
              onExitRight();
            } else if (onExitLeft) {
              onExitLeft();
            }
            setTimeout(() => {
              if (swipeableRef.current) {
                swipeableRef.current.style.transform = "";
                swipeableRef.current.style.transition = "none";
              } else throw new Error("No ref found for card");
            }, 200);
          },
          { once: true }
        );
      }
      swipeableRef.current.style.removeProperty("cursor");
    });

    return () => {
      hammertime.off("pan panend");
    };
  }, [onExitLeft, onExitRight, canSwipe, onSwipe]);

  useEffect(() => {
    if (swipeableRef.current) {
      hammertimeRef.current = new Hammer(swipeableRef.current, {
        recognizers: [[Hammer.Tap], [Hammer.Pan]],
      });
    } else {
      throw new Error("No ref found for swipeable");
    }
  }, []);

  useEffect(() => {
    const removeSwipe = addSwipe();
    return removeSwipe;
  }, [addSwipe]);

  return (
    <div
      className="transition-all duration-500 ease-in-out cursor-grab"
      ref={swipeableRef}
    >
      {children}
    </div>
  );
}

export default Swipeable;
