import React, { Component } from "react";

import { _get, arraysEqual } from "../utility/generic";
import { Keys } from "../types";

type propTypes = {
  groups: any[];
  width: number;
  height: number;
  groupHeights: number[];
  keys: Keys;
};
class Sidebar extends Component<propTypes> {
  shouldComponentUpdate(nextProps: any) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights)
    );
  }

  render(): React.ReactNode {
    const { width, groupHeights, height } = this.props;

    const { groupIdKey, groupTitleKey } = this.props.keys;

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`,
    };

    const groupsStyle = {
      width: `${width}px`,
    };

    return (
      <div className={"rct-sidebar"} style={sidebarStyle}>
        <div style={groupsStyle}>
          {this.props.groups.map((group, index) => {
            const elementStyle = {
              height: `${groupHeights[index]}px`,
              lineHeight: `${groupHeights[index]}px`,
            };

            return (
              <div
                key={_get(group, groupIdKey)}
                className={
                  "rct-sidebar-row rct-sidebar-row-" +
                  (index % 2 === 0 ? "even" : "odd")
                }
                style={elementStyle}
              >
                {" "}
                {_get(group, groupTitleKey)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Sidebar;
