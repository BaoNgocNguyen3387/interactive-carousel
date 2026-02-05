import {
  PointerEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ISlideItem, ISlideProps } from "../interface";
import "../styles/index.css";
import {
  AUTO_PLAY_DELAY,
  BUFFER,
  CARD_WIDTH,
  DRAG_THRESHOLD,
  MINIMUM_SLIDES,
  VIEWPORT_WIDTH,
} from "../constants";
import SlideItem from "./SlideItem";
import { rotateLeft, rotateRight } from "../utils";

const SlideContainer = ({
  slideList,
  timeAutoPlay = AUTO_PLAY_DELAY,
  viewportWidth = VIEWPORT_WIDTH,
}: ISlideProps) => {
  const [itemList, setItemList] = useState<ISlideItem[]>(slideList);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [pause, setPause] = useState(false);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH);

  const trackRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const el = document.querySelector(".slide") as HTMLElement;
    if (!el) return;

    const calCardWidth = () => {
      const rect = el.getBoundingClientRect();
      setCardWidth((rect.width - 24) / 2.5);
    };

    calCardWidth();

    window.addEventListener("resize", calCardWidth);

    return () => window.removeEventListener("resize", calCardWidth);
  }, []);

  useEffect(() => {
    if (!slideList?.length) return;
    setItemList(slideList);
  }, [slideList]);

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (pause || isDragging) return;

    const slideNext = () => {
      const track = trackRef.current;
      if (!track) return;

      track.style.transition = "transform 0.4s ease";
      setTranslateX(-cardWidth);

      track.addEventListener(
        "transitionend",
        () => {
          track.style.transition = "none";
          setItemList((prev) => rotateLeft(prev, 1));
          setTranslateX(0);
        },
        { once: true },
      );
    };

    const timer = setInterval(() => {
      slideNext();
    }, timeAutoPlay);

    return () => clearInterval(timer);
  }, [pause, isDragging, timeAutoPlay]);

  /* ================= DRAG ================= */
  const startDrag = (e: PointerEvent) => {
    e.preventDefault();

    setIsDragging(true);
    setStartX(e.clientX);
    setDragStartX(translateX);

    const track = trackRef.current;
    if (!track) return;

    track.style.transition = "none";
    track.setPointerCapture(e.pointerId);
  };

  const onDrag = (e: PointerEvent) => {
    if (!isDragging) return;
    setTranslateX(dragStartX + (e.clientX - startX));
  };

  const endDrag = (e: PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = e.clientX - startX;
    const abs = Math.abs(diff);
    const track = trackRef.current;
    if (!track) return;

    track.releasePointerCapture(e.pointerId);

    const shiftCount = Math.round(abs / cardWidth);
    if (shiftCount === 0 || abs < DRAG_THRESHOLD) {
      track.style.transition = "transform 0.3s ease";
      setTranslateX(0);
      return;
    }

    track.style.transition = "none";

    setItemList((prev) =>
      diff < 0 ? rotateLeft(prev, shiftCount) : rotateRight(prev, shiftCount),
    );

    setTranslateX(0);

    requestAnimationFrame(() => {
      track.style.transition = "transform 0.4s ease";
    });
  };

  const extendedItems = useMemo(() => {
    if (!itemList.length) return [];

    return [
      ...itemList.slice(-BUFFER),
      ...itemList,
      ...itemList.slice(0, BUFFER),
    ];
  }, [itemList]);

  if (slideList?.length < MINIMUM_SLIDES)
    return <p>Not enough slides to display</p>;

  return (
    <div
      className="slide"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      style={{ maxWidth: viewportWidth, width: "100%" }}
    >
      <ul
        ref={trackRef}
        className="slide-list"
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {extendedItems.map((slide, i) => (
          <SlideItem
            key={`${slide.id}-${i}`}
            slide={slide}
            cardWidth={cardWidth}
            isDragging={isDragging}
          />
        ))}
      </ul>
    </div>
  );
};

export default SlideContainer;
