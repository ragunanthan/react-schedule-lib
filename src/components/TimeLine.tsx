import React, { Component, createRef } from "react";
import windowResizeDetector from "./resize-detector/window";

import {
  getMinUnit,
  calculateScrollCanvas,
  stackTimelineItems,
} from "./utility/calendar";
import { Props, State } from "./types";
import { defaultKeys, defaultProps } from "./defaultProps";
import ScrollElement from "./scroll/ScrollElement";
import Sidebar from "./layout/Sidebar";
import { TimelineStateProvider } from "./timeline/TimelineStateContext";
import ColumnsWrapper from "./columns/Columns";
import { _length } from "./utility/generic";
// import "./Timeline.scss";

import TimelineHeaders from "./headers/TimelineHeaders";
import Items from "./items/Items";

export default class ReactCalendarTimeline extends Component<Props, State> {
  static defaultProps = defaultProps;
  static state: State;
  private container = createRef<HTMLDivElement>();
  private scrollComponent = createRef<HTMLDivElement>();
  private scrollHeaderRef = createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    if (!this.props.visibleTimeStart && !this.props.visibleTimeEnd) {
      //throwing an error because neither default or visible time props provided
      throw new Error(
        'You must provide"visibleTimeStart" and "visibleTimeEnd" to initialize the Timeline',
      );
    }
    const width = 1000;
    const draggingItem = null;
    const resizingItem = null;
    const dragTime = null;
    const resizingEdge = null;
    const resizeTime = null;
    const newGroupOrder = null;

    const canvasWidth = width;

    const { dimensionItems, height, groupHeights } = stackTimelineItems(
      this.props.items,
      props.groups,
      canvasWidth,
      this.props.visibleTimeStart,
      this.props.visibleTimeEnd,
      props.keys ?? defaultKeys,
      props.lineHeight ?? defaultProps.lineHeight,
      props.itemHeightRatio ?? defaultProps.itemHeightRatio,
      props.stackItems ?? defaultProps.stackItems,
      draggingItem,
      resizingItem,
      dragTime,
      resizingEdge,
      resizeTime,
      newGroupOrder,
    );

    this.state = {
      width: width,
      visibleTimeStart: this.props.visibleTimeStart,
      visibleTimeEnd: this.props.visibleTimeEnd,
      canvasTimeStart: this.props.visibleTimeStart,
      canvasTimeEnd: this.props.visibleTimeEnd,
      selectedItem: null,
      dragTime: dragTime,
      dragGroupTitle: null,
      resizeTime: resizeTime,
      resizingItem: resizingItem,
      resizingEdge: resizingEdge,
      dimensionItems: dimensionItems,
      height: height,
      groupHeights: groupHeights,
      newGroupOrder: newGroupOrder,
      draggingItem: draggingItem,
    };
  }

  componentDidMount() {
    this.resize(this.props);
    windowResizeDetector.addListener(this);
  }

  componentWillUnmount() {
    windowResizeDetector.removeListener(this);
  }

  resize = (props = this.props) => {
    if (this.container.current) {
      const { width: containerWidth } =
        this.container.current.getBoundingClientRect();
      let width =
        containerWidth - (props?.sidebarWidth ?? defaultProps.sidebarWidth);
      const canvasWidth = width;
      const { dimensionItems, height, groupHeights } = stackTimelineItems(
        props.items,
        props.groups,
        canvasWidth,
        this.state.canvasTimeStart,
        this.state.canvasTimeEnd,
        props.keys ?? defaultProps.keys,
        props.lineHeight ?? defaultProps.lineHeight,
        props.itemHeightRatio ?? defaultProps.itemHeightRatio,
        props.stackItems ?? defaultProps.stackItems,
        this.state.draggingItem,
        this.state.resizingItem,
        this.state.dragTime,
        this.state.resizingEdge,
        this.state.resizeTime,
        this.state.newGroupOrder,
      );

      // this is needed by dragItem since it uses pageY from the drag events
      // if this was in the context of the scrollElement, this would not be necessary

      this.setState({
        width,
        dimensionItems,
        height,
        groupHeights,
      });
      const scrollLeft = width * ((1 - 1) / 2);

      if (this.scrollComponent.current && this.scrollHeaderRef.current) {
        this.scrollComponent.current.scrollLeft = scrollLeft;
        this.scrollHeaderRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  public static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { visibleTimeStart, visibleTimeEnd, items, groups } = nextProps;

    // This is a gross hack pushing items and groups in to state only to allow
    // For the forceUpdate check
    let derivedState = { items, groups };

    // if the items or groups have changed we must re-render
    const forceUpdate =
      items !== prevState.items || groups !== prevState.groups;

    // We are a controlled component
    if (visibleTimeStart && visibleTimeEnd) {
      // Get the new canvas position
      Object.assign(
        derivedState,
        calculateScrollCanvas(
          visibleTimeStart,
          visibleTimeEnd,
          forceUpdate,
          items,
          groups,
          nextProps,
          prevState,
        ),
      );
    } else if (forceUpdate) {
      console.log("forceUpdate", forceUpdate);
      // Calculate new item stack position as canvas may have changed
      const canvasWidth = prevState.width;
      Object.assign(
        derivedState,
        stackTimelineItems(
          items,
          groups,
          canvasWidth,
          prevState.canvasTimeStart,
          prevState.canvasTimeEnd,
          nextProps.keys,
          nextProps.lineHeight,
          nextProps.itemHeightRatio,
          nextProps.stackItems,
          prevState.draggingItem,
          prevState.resizingItem,
          prevState.dragTime,
          prevState.resizingEdge,
          prevState.resizeTime,
          prevState.newGroupOrder,
        ),
      );
    }

    return derivedState;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const newZoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
    const oldZoom = prevState.visibleTimeEnd - prevState.visibleTimeStart;

    // The bounds have changed? Report it!
    if (
      this.props.onBoundsChange &&
      this.state.canvasTimeStart !== prevState.canvasTimeStart
    ) {
      this.props.onBoundsChange(
        this.state.canvasTimeStart,
        this.state.canvasTimeStart + newZoom * 3,
      );
    }

    // Check the scroll is correct
    const scrollLeft = Math.round(
      (this.state.width *
        (this.state.visibleTimeStart - this.state.canvasTimeStart)) /
        newZoom,
    );
    const componentScrollLeft = Math.round(
      (prevState.width *
        (prevState.visibleTimeStart - prevState.canvasTimeStart)) /
        oldZoom,
    );

    if (componentScrollLeft !== scrollLeft) {
      if (this.scrollComponent.current && this.scrollHeaderRef.current) {
        console.log(this.scrollComponent.current);
        this.scrollComponent.current.scrollLeft = scrollLeft;
        this.scrollHeaderRef.current.scrollLeft = scrollLeft;
      }
    }
  }
  private getTimelineUnit = () => {
    const { width, visibleTimeStart, visibleTimeEnd } = this.state;

    const timeSteps = this.props.timeSteps || defaultProps.timeSteps;

    const zoom = visibleTimeEnd - visibleTimeStart;
    const minUnit = getMinUnit(zoom, width, timeSteps);

    return minUnit;
  };

  // called when the visible time changes
  private updateScrollCanvas = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    forceUpdateDimensions: boolean,
    items = this.props.items,
    groups = this.props.groups,
  ) => {
    this.setState(
      calculateScrollCanvas(
        visibleTimeStart,
        visibleTimeEnd,
        forceUpdateDimensions,
        items,
        groups,
        this.props,
        this.state,
      ),
    );
  };

  // TODO Ragu Need to check this function
  showPeriod = (from: any, to: any) => {
    let visibleTimeStart = from.valueOf();
    let visibleTimeEnd = to.valueOf();
    let zoom = visibleTimeEnd - visibleTimeStart;

    if (this.props.onTimeChange)
      this.props.onTimeChange(
        visibleTimeStart,
        visibleTimeStart + zoom,
        this.updateScrollCanvas,
        this.getTimelineUnit(),
      );
  };

  selectItem = (item: any, clickType: any, e: any) => {
    if (
      this.isItemSelected(item) ||
      (this.props.itemTouchSendsClick && clickType === "touch")
    ) {
      if (item && this.props.onItemClick) {
        const time = this.timeFromItemEvent(e);
        this.props.onItemClick(item, e, time);
      }
    } else {
      this.setState({ selectedItem: item });
      if (item && this.props.onItemSelect) {
        const time = this.timeFromItemEvent(e);
        this.props.onItemSelect(item, e, time);
      } else if (item === null && this.props.onItemDeselect) {
        this.props.onItemDeselect(e); // this isnt in the docs. Is this function even used?
      }
    }
  };

  doubleClickItem = (item: any, e: any) => {
    if (this.props.onItemDoubleClick) {
      const time = this.timeFromItemEvent(e);
      this.props.onItemDoubleClick(item, e, time);
    }
  };

  timeFromItemEvent = (e: any) => {
    const { width, visibleTimeStart, visibleTimeEnd } = this.state;
    const dragSnap = defaultProps.dragSnap;

    const scrollComponent = this.scrollComponent.current;
    if (scrollComponent) {
      console.log(scrollComponent);

      const { left: scrollX } = scrollComponent.getBoundingClientRect();

      const xRelativeToTimeline = e.clientX - scrollX;

      const relativeItemPosition = xRelativeToTimeline / width;
      const zoom = visibleTimeEnd - visibleTimeStart;
      const timeOffset = relativeItemPosition * zoom;

      let time = Math.round(visibleTimeStart + timeOffset);
      time = Math.floor(time / dragSnap) * dragSnap;

      return time;
    }
  };

  getSelected = () => {
    return this.state.selectedItem && !this.props.selected
      ? [this.state.selectedItem]
      : this.props.selected || [];
  };

  hasSelectedItem = () => {
    if (!Array.isArray(this.props.selected)) return !!this.state.selectedItem;
    return this.props.selected.length > 0;
  };

  isItemSelected = (itemId: number) => {
    const selectedItems = this.getSelected();
    return selectedItems.some((i) => i === itemId);
  };
  getScrollElementRef = (el: any) => {
    this.scrollComponent = el;
    if (this.props.scrollRef) {
      this.props.scrollRef(el);
    }
  };
  render(): React.ReactNode {
    const {
      sidebarWidth = defaultProps.sidebarWidth,
      timeSteps = defaultProps.timeSteps,
    } = this.props;
    const {
      width,
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd,
      dimensionItems,
      height,
      groupHeights,
    } = this.state;
    const zoom = visibleTimeEnd - visibleTimeStart;
    const canvasWidth = width;
    const minUnit = getMinUnit(zoom, width, timeSteps);
    return (
      <TimelineStateProvider
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        canvasTimeStart={canvasTimeStart}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
        showPeriod={this.showPeriod}
        timelineUnit={minUnit}
        timelineWidth={this.state.width}
      >
        <div
          style={this.props.style}
          ref={this.container}
          className={`react-calendar-timeline ${this.props.className}`}
        >
          <TimelineHeaders
            innerRef={this.scrollHeaderRef}
            timeSteps={timeSteps}
            leftSidebarWidth={
              this.props.sidebarWidth ?? defaultProps.sidebarWidth
            }
          />
          <div style={{ height: `${height}px` }} className="rct-outer">
            {sidebarWidth > 0 ? (
              <Sidebar
                groups={this.props.groups}
                keys={this.props.keys ?? defaultProps.keys}
                width={sidebarWidth}
                groupHeights={groupHeights}
                height={height}
              />
            ) : null}
            <ScrollElement
              scrollRef={this.getScrollElementRef}
              width={width}
              height={height}
            >
              <>
                <Items
                  canvasTimeStart={canvasTimeStart}
                  canvasTimeEnd={canvasTimeEnd}
                  canvasWidth={canvasWidth}
                  dimensionItems={dimensionItems}
                  items={this.props.items}
                  groups={this.props.groups}
                  keys={this.props.keys ?? defaultKeys}
                  selectedItem={this.state.selectedItem}
                  itemSelect={this.selectItem}
                  selected={this.props.selected ?? []}
                  scrollRef={this.scrollComponent.current}
                />
                <ColumnsWrapper
                  canvasTimeStart={canvasTimeStart}
                  canvasTimeEnd={canvasTimeEnd}
                  canvasWidth={canvasWidth}
                  lineCount={_length(this.props.groups)}
                  minUnit={minUnit}
                  timeSteps={timeSteps}
                  height={height}
                  verticalLineClassNamesForTime={
                    this.props.verticalLineClassNamesForTime
                  }
                />
              </>
            </ScrollElement>
          </div>
        </div>
      </TimelineStateProvider>
    );
  }
}
