import { MouseEvent } from "react";
import { ISlideItemProps } from "../interface";

const SlideItem = ({ slide, cardWidth, isDragging }: ISlideItemProps) => {
  const onClickSlide = (e: MouseEvent<HTMLLIElement>) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    window.open(slide?.landing_page, "_blank");
  };

  return (
    <li
      className="slide-item"
      style={{ width: cardWidth, height: cardWidth }}
      onClick={onClickSlide}
    >
      <img src={slide?.image} alt={slide?.title} />
    </li>
  );
};

export default SlideItem;
