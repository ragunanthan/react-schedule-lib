/* eslint-disable no-console */
import React, { Component } from "react";
import moment from "moment";

import generateFakeData from "./generate-fake-data.json";
import TimeLine from "../components/TimeLine";
import "./Timeline.css"

var minTime = moment().add(-6, "months").valueOf();
var maxTime = moment().add(6, "months").valueOf();

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
};

export default class App extends Component {
  constructor(props) {
    super(props);

    const { groups, items } = generateFakeData;
    const visibleTimeStart = moment()
      .startOf("year")
      .add(1, "months")
      .valueOf();
    const visibleTimeEnd = moment().startOf("year").add(6, "months").valueOf();

    this.state = {
      groups,
      items,
      visibleTimeStart,
      visibleTimeEnd,
    };
  }

  handleCanvasDoubleClick = (groupId, time) => {
    console.log("Canvas double clicked", groupId, moment(time).format());
  };

  handleCanvasContextMenu = (group, time) => {
    console.log("Canvas context menu", group, moment(time).format());
  };

  handleItemClick = (itemId, _, time) => {
    console.log("Clicked: " + itemId, moment(time).format());
  };

  handleItemSelect = (itemId, _, time) => {
    console.log("Selected: " + itemId, moment(time).format());
  };

  handleItemDoubleClick = (itemId, _, time) => {
    console.log("Double Click: " + itemId, moment(time).format());
  };

  handleItemContextMenu = (itemId, _, time) => {
    console.log("Context Menu: " + itemId, moment(time).format());
  };

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            })
          : item,
      ),
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time,
            })
          : item,
      ),
    });

    console.log("Resized", itemId, time, edge);
  };

  // this limits the timeline to -6 months ... +6 months
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(
        minTime,
        minTime + (visibleTimeEnd - visibleTimeStart),
      );
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(
        maxTime - (visibleTimeEnd - visibleTimeStart),
        maxTime,
      );
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  moveResizeValidator = (action, item, time) => {
    if (time < new Date().getTime()) {
      var newTime =
        Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
      return newTime;
    }

    return time;
  };

  onPrevClick = () => {
    this.setState((state) => {
      return {
        visibleTimeStart: moment(state.visibleTimeStart)
          .subtract(5, "months")
          .startOf("month")
          .valueOf(),
        visibleTimeEnd: moment(state.visibleTimeEnd)
          .subtract(5, "months")
          .valueOf(),
      };
    });
  };

  onNextClick = () => {
    this.setState((state) => {
      return {
        visibleTimeStart: moment(state.visibleTimeStart)
          .add(5, "months")
          .startOf("month")
          .valueOf(),
        visibleTimeEnd: moment(state.visibleTimeEnd).add(5, "months").valueOf(),
      };
    });
  };

  getMinutesOfDay = (date) => {
    return date.hours() * 60 + date.minutes();
  };

  verticalLineClassNamesForTime = (timeStart, timeEnd) => {
    const currentTimeStart = moment(timeStart);
    const currentTimeEnd = moment(timeEnd);
    // console.log(timeStart, timeEnd);
    let classes = [];

    const lunchStart = moment().hours(12).minutes(0).seconds(0);
    const lunchEnd = moment().hours(13).minutes(0).seconds(0);

    if (
      this.getMinutesOfDay(currentTimeStart) >=
        this.getMinutesOfDay(lunchStart) &&
      this.getMinutesOfDay(currentTimeEnd) <= this.getMinutesOfDay(lunchEnd)
    ) {
      classes.push("lunch");
    }

    return classes;
  };

  render() {
    // console.log(this.state);
    const { groups, items, visibleTimeStart, visibleTimeEnd } = this.state;

    return (
      <div>
        <button onClick={this.onPrevClick}>{"< Prev"}</button>
        <button onClick={this.onNextClick}>{"Next >"}</button>
        <TimeLine
          groups={groups}
          items={items}
          keys={keys}
          sidebarWidth={150}
          sidebarContent={<div>Above The Left</div>}
          canMove
          canResize="right"
          canSelect
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={0.25}
          visibleTimeStart={visibleTimeStart}
          visibleTimeEnd={visibleTimeEnd}
          onCanvasDoubleClick={this.handleCanvasDoubleClick}
          onCanvasContextMenu={this.handleCanvasContextMenu}
          onItemClick={this.handleItemClick}
          onItemSelect={this.handleItemSelect}
          onItemContextMenu={this.handleItemContextMenu}
          onItemMove={this.handleItemMove}
          onItemResize={this.handleItemResize}
          onItemDoubleClick={this.handleItemDoubleClick}
          buffer={1}
          onTimeChange={this.handleTimeChange}
          verticalLineClassNamesForTime={this.verticalLineClassNamesForTime}
          // moveResizeValidator={this.moveResizeValidator}
        ></TimeLine>
      </div>
    );
  }
}
