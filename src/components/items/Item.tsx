import { Component } from "react";

import { _get, deepObjectCompare } from "../utility/generic";
import { composeEvents } from "../utility/events";
import { defaultItemRenderer } from "./defaultItemRenderer";
import { overridableStyles, selectedStyle } from "./styles";
import { defaultKeys } from "../defaultProps";

type propTypes = {
  canvasTimeStart: number;
  canvasTimeEnd: number;
  canvasWidth: number;
  order: {
    index: number;
  };

  selected: boolean;

  scrollRef: HTMLDivElement | null;
  keys: typeof defaultKeys;
  item: {
    className: string;
  };
  onSelect: (item: any, clickType: any, e: any) => void;
  dimensions: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

type stateType = {
  interactMounted: boolean;
};
export default class Item extends Component<propTypes, stateType> {
  item: HTMLDivElement | undefined;
  itemId: number | undefined;
  itemTitle: number | undefined;
  itemDivTitle: number | undefined;
  itemTimeStart: number | undefined;
  itemTimeEnd: number | undefined;
  constructor(props: propTypes) {
    super(props);

    this.cacheDataFromProps(props);
    this.state = {
      interactMounted: false,
    };
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    var shouldUpdate =
      nextProps.keys !== this.props.keys ||
      nextProps.selected !== this.props.selected ||
      nextProps.item !== this.props.item ||
      nextProps.canvasTimeStart !== this.props.canvasTimeStart ||
      nextProps.canvasTimeEnd !== this.props.canvasTimeEnd ||
      nextProps.canvasWidth !== this.props.canvasWidth ||
      (nextProps.order ? nextProps.order.index : undefined) !==
        (this.props.order ? this.props.order.index : undefined) ||
      nextProps.dimensions !== this.props.dimensions;
    return shouldUpdate;
  }

  private cacheDataFromProps(props: propTypes) {
    this.itemId = _get(props.item, props.keys.itemIdKey);
    this.itemTitle = _get(props.item, props.keys.itemTitleKey);
    this.itemDivTitle = props.keys.itemDivTitleKey
      ? _get(props.item, props.keys.itemDivTitleKey)
      : this.itemTitle;
    this.itemTimeStart = _get(props.item, props.keys.itemTimeStartKey);
    this.itemTimeEnd = _get(props.item, props.keys.itemTimeEndKey);
  }

  componentDidUpdate() {
    this.cacheDataFromProps(this.props);
    let { interactMounted } = this.state;

    interactMounted = false;

    this.setState({
      interactMounted,
    });
  }

  onMouseDown = (e: any) => {
    if (!this.state.interactMounted) {
      e.preventDefault();
    }
  };

  onMouseUp = (e: any) => {
    if (!this.state.interactMounted) {
      this.actualClick(e, "click");
    }
  };

  onTouchStart = (e: any) => {
    if (!this.state.interactMounted) {
      e.preventDefault();
    }
  };

  onTouchEnd = (e: any) => {
    if (!this.state.interactMounted) {
      this.actualClick(e, "touch");
    }
  };

  actualClick(e: any, clickType: any) {
    if (this.props.onSelect) {
      this.props.onSelect(
        _get(this.props.item, this.props.keys.itemIdKey),
        clickType,
        e,
      );
    }
  }
  getItemRef = (el: any) => (this.item = el);

  getItemProps = (props: any) => {
    //TODO: maybe shouldnt include all of these classes
    const classNames =
      "rct-item" +
      (this.props.item.className ? ` ${this.props.item.className}` : "");

    return {
      key: this.itemId,
      ref: this.getItemRef,
      title: this.itemDivTitle,
      className: classNames + ` ${props.className ? props.className : ""}`,
      onMouseDown: composeEvents(this.onMouseDown, props.onMouseDown),
      onMouseUp: composeEvents(this.onMouseUp, props.onMouseUp),
      onTouchStart: composeEvents(this.onTouchStart, props.onTouchStart),
      onTouchEnd: composeEvents(this.onTouchEnd, props.onTouchEnd),
      style: Object.assign({}, this.getItemStyle(props)),
    };
  };

  getItemStyle(props: any) {
    const dimensions = this.props.dimensions;

    const baseStyles = {
      position: "absolute",
      boxSizing: "border-box",
      left: `${dimensions.left}px`,
      top: `${dimensions.top}px`,
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      lineHeight: `${dimensions.height}px`,
    };

    const finalStyle = Object.assign(
      {},
      overridableStyles,
      this.props.selected ? selectedStyle : {},

      this.props.selected && props.style,
      baseStyles,
    );
    return finalStyle;
  }

  render(): React.ReactNode {
    if (typeof this.props.order === "undefined" || this.props.order === null) {
      console.log("SDad");

      return null;
    }

    const itemContext = {
      dimensions: this.props.dimensions,
      selected: this.props.selected,
      width: this.props.dimensions.width,
    };

    return defaultItemRenderer({
      item: this.props.item,
      itemContext,
      getItemProps: this.getItemProps,
    });
  }
}
