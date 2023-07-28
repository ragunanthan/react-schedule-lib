export const defaultKeys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  groupLabelKey: "title",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start_time",
  itemTimeEndKey: "end_time",
};

export const defaultTimeSteps = {
  second: 1,
  minute: 1,
  hour: 1,
  day: 1,
  month: 1,
  year: 1,
};

export const defaultHeaderFormats = {
  year: {
    long: "YYYY",
    mediumLong: "YYYY",
    medium: "YYYY",
    short: "YY",
  },
  month: {
    long: "MMMM YYYY",
    mediumLong: "MMMM",
    medium: "MMMM",
    short: "MM/YY",
  },
  week: {
    long: "w",
    mediumLong: "w",
    medium: "w",
    short: "w",
  },
  day: {
    long: "dddd, LL",
    mediumLong: "dddd, LL",
    medium: "dd D",
    short: "D",
  },
  hour: {
    long: "dddd, LL, HH:00",
    mediumLong: "L, HH:00",
    medium: "HH:00",
    short: "HH",
  },
  minute: {
    long: "HH:mm",
    mediumLong: "HH:mm",
    medium: "HH:mm",
    short: "mm",
  },
  second: {
    long: "mm:ss",
    mediumLong: "mm:ss",
    medium: "mm:ss",
    short: "ss",
  },
};

export const defaultProps = {
  sidebarWidth: 150,
  // rightSidebarWidth: 0,
  dragSnap: 1000 * 60 * 15, // 15min
  minResizeWidth: 20,
  lineHeight: 30,
  itemHeightRatio: 0.65,

  minZoom: 60 * 60 * 1000, // 1 hour
  maxZoom: 5 * 365.24 * 86400 * 1000, // 5 years

  clickTolerance: 3, // how many pixels can we drag for it to be still considered a click?

  canChangeGroup: true,
  canMove: true,
  canResize: "right",
  useResizeHandle: false,
  canSelect: true,

  stackItems: false,

  traditionalZoom: false,

  horizontalLineClassNamesForGroup: null,

  onItemMove: null,
  onItemResize: null,
  onItemClick: null,
  onItemSelect: null,
  onItemDeselect: null,
  onItemDrag: null,
  onCanvasClick: null,
  onItemDoubleClick: null,

  verticalLineClassNamesForTime: null,

  moveResizeValidator: null,

  dayBackground: null,

  defaultTimeStart: null,
  defaultTimeEnd: null,

  itemTouchSendsClick: false,

  style: {},
  className: "",
  keys: defaultKeys,
  timeSteps: defaultTimeSteps,
  headerRef: () => {},
  scrollRef: () => {},

  // if you pass in visibleTimeStart and visibleTimeEnd, you must also pass onTimeChange(visibleTimeStart, visibleTimeEnd),
  // which needs to update the props visibleTimeStart and visibleTimeEnd to the ones passed
  visibleTimeStart: null,
  visibleTimeEnd: null,
  onTimeChange: function (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: Function,
  ) {
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
  },
  // called when the canvas area of the calendar changes
  onBoundsChange: null,
  children: null,

  selected: null,
};
