import React, { RefObject } from "react";
import classNames from "classnames";
import SidebarHeader from "./SidebarHeader";
import DateHeaderWrapper from "./DateHeader";

type propTypes = {
  innerRef: RefObject<HTMLDivElement>;
  leftSidebarWidth: number;
  style?: {};
  className?: string;
  calendarHeaderStyle?: {};
  calendarHeaderClassName?: string;
  timeSteps: {};
};
export default class TimelineHeaders extends React.Component<propTypes> {
  constructor(props: propTypes) {
    super(props);
  }

  getRootStyle = () => {
    return {
      ...this.props.style,
      display: "flex",
      width: "100%",
    };
  };

  getCalendarHeaderStyle = () => {
    const { leftSidebarWidth, calendarHeaderStyle } = this.props;
    return {
      ...calendarHeaderStyle,
      overflow: "hidden",
      width: `calc(100% - ${leftSidebarWidth}px)`,
    };
  };

  render() {
    return (
      <div
        data-testid="headerRootDiv"
        style={this.getRootStyle()}
        className={classNames("rct-header-root", this.props.className)}
      >
        {/* leftSidebarHeader */}
        <SidebarHeader leftSidebarWidth={this.props.leftSidebarWidth} />
        <div
          ref={this.props.innerRef}
          style={this.getCalendarHeaderStyle()}
          className={classNames(
            "rct-calendar-header",
            this.props.calendarHeaderClassName,
          )}
          data-testid="headerContainer"
        >
          <DateHeaderWrapper timeSteps={this.props.timeSteps} />
        </div>
      </div>
    );
  }
}
