import React, { Component } from "react";
import Item from "./Item";
// import ItemGroup from './ItemGroup'

import { _get, arraysEqual, keyBy } from "../utility/generic";
import { getGroupOrders, getVisibleItems } from "../utility/calendar";
import { defaultKeys } from "../defaultProps";

type propTypes = {
  groups: any[];
  items: any[];
  canvasTimeStart: number;
  canvasTimeEnd: number;
  canvasWidth: number;
  selectedItem: string | number;
  keys: typeof defaultKeys;
  itemSelect: (item: any, clickType: any, e: any) => void;
  selected: any[];
  dimensionItems: any[];
  scrollRef: HTMLDivElement | null;
};

export default class Items extends Component<propTypes, {}> {
  shouldComponentUpdate(nextProps: any) {
    return !(
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.items, this.props.items) &&
      arraysEqual(nextProps.dimensionItems, this.props.dimensionItems) &&
      nextProps.keys === this.props.keys &&
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.selectedItem === this.props.selectedItem &&
      nextProps.selected === this.props.selected
    );
  }

  private isSelected(item: any, itemIdKey: string | number) {
    if (!this.props.selected) {
      return this.props.selectedItem === _get(item, itemIdKey);
    } else {
      let target = _get(item, itemIdKey);
      return this.props.selected.includes(target);
    }
  }

  private getVisibleItems(canvasTimeStart: number, canvasTimeEnd: number) {
    const { keys, items } = this.props;

    return getVisibleItems(items, canvasTimeStart, canvasTimeEnd, keys);
  }

  render(): React.ReactNode {
    const { canvasTimeStart, canvasTimeEnd, dimensionItems, keys, groups } =
      this.props;
    const { itemIdKey, itemGroupKey } = keys;

    const groupOrders = getGroupOrders(groups, keys);
    const visibleItems = this.getVisibleItems(canvasTimeStart, canvasTimeEnd);
    const sortedDimensionItems = keyBy(dimensionItems, "id");
    console.log(visibleItems);

    return (
      <div className="rct-items">
        {visibleItems
          .filter((item) => sortedDimensionItems[_get(item, itemIdKey)])
          .map((item) => (
            <Item
              key={_get(item, itemIdKey)}
              item={item}
              keys={this.props.keys}
              order={groupOrders[_get(item, itemGroupKey)]}
              dimensions={
                sortedDimensionItems[_get(item, itemIdKey)].dimensions
              }
              selected={this.isSelected(item, itemIdKey) ?? false}
              canvasTimeStart={this.props.canvasTimeStart}
              canvasTimeEnd={this.props.canvasTimeEnd}
              canvasWidth={this.props.canvasWidth}
              onSelect={this.props.itemSelect}
              scrollRef={this.props.scrollRef}
            />
          ))}
      </div>
    );
  }
}
