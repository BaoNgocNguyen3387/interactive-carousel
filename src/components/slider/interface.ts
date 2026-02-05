export interface ISlideItem {
  id: number;
  title: string;
  image: string;
  landing_page: string;
}

export interface ISlideProps {
  slideList: ISlideItem[];
  timeAutoPlay?: number;
  viewportWidth?: number;
}

export interface ISlideItemProps {
  slide: ISlideItem;
  cardWidth: number;
  isDragging: boolean;
}
