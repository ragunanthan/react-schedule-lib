interface Group {
  [key: string]: any;
}

interface Item {
  [key: string]: any;
}

export interface Keys {
  groupIdKey: string;
  groupTitleKey: string;
  groupLabelKey: string;
  groupRightTitleKey: string;
  itemIdKey: string;
  itemTitleKey: string;
  itemDivTitleKey: string;
  itemGroupKey: string;
  itemTimeStartKey: string;
  itemTimeEndKey: string;
}

export interface TimeSteps {
  second: number;
  minute: number;
  hour: number;
  day: number;
  month: number;
  year: number;
}

export type Props = {
  groups: Group[];
  items: Item[];
  sidebarWidth?: number;
  minResizeWidth?: number;
  lineHeight?: number;
  itemHeightRatio?: number;
  canSelect?: boolean;
  stackItems?: boolean;
  traditionalZoom?: boolean;
  itemTouchSendsClick?: boolean;
  horizontalLineClassNamesForGroup?: Function;
  onItemMove?: Function;
  onItemResize?: Function;
  onItemClick?: Function;
  onItemSelect?: Function;
  onItemDeselect?: Function;
  onCanvasClick?: Function;
  onItemDoubleClick?: Function;
  className?: string;
  style?: object;
  keys?: Keys;
  headerRef?: Function;
  scrollRef?: Function;
  timeSteps?: TimeSteps;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  onTimeChange?: Function;
  onBoundsChange?: Function;
  selected?: any[];
  verticalLineClassNamesForTime?: (a: any, b: any) => string[];
};
export interface State {
  width: number;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  canvasTimeStart: number;
  canvasTimeEnd: number;
  selectedItem: any | null;
  dragTime: number | null;
  dragGroupTitle: string | null;
  resizeTime: number | null;
  resizingItem: any | null;
  resizingEdge: "left" | "right" | null;
  dimensionItems: dimensionItemsType;
  height: number;
  groupHeights: number[];
  newGroupOrder: any;
  draggingItem: any;
}
export type dimensionItemsType = {
  id: any;
  dimensions: {
    top: number | null;
    order: {
      index: number;
      group: any;
    };
    stack: boolean;
    height: number;
    left: number;
    width: number;
    collisionLeft: number;
    collisionWidth: number;
  };
}[];
