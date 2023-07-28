import React, { Component } from "react";

import { iterateTimes } from "../utility/calendar";
import { TimelineStateConsumer } from "../timeline/TimelineStateContext";
import { defaultTimeSteps } from "../defaultProps";

type passThroughPropTypes = {
  canvasTimeStart: number;
  canvasTimeEnd: number;
  canvasWidth: number;
  lineCount: number;
  minUnit: keyof typeof defaultTimeSteps;
  timeSteps: typeof defaultTimeSteps;
  height: number;
  verticalLineClassNamesForTime?: (a: any, b: any) => string[];
};

class Columns extends Component<
  passThroughPropTypes & { getLeftOffsetFromDate: any }
> {
  shouldComponentUpdate(nextProps: any) {
    return !(
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.minUnit === this.props.minUnit &&
      nextProps.timeSteps === this.props.timeSteps &&
      nextProps.height === this.props.height &&
      nextProps.verticalLineClassNamesForTime ===
        this.props.verticalLineClassNamesForTime
    );
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minUnit,
      timeSteps,
      height,
      verticalLineClassNamesForTime,
      getLeftOffsetFromDate,
      lineCount,
    } = this.props;
    let lines: React.ReactNode[] = [];

    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        const minUnitValue = time.get(minUnit === "day" ? "date" : minUnit);
        const firstOfType = minUnitValue === (minUnit === "day" ? 1 : 0);

        let classNamesForTime: string[] = [];
        if (verticalLineClassNamesForTime) {
          classNamesForTime = verticalLineClassNamesForTime(
            time.unix() * 1000, // turn into ms, which is what verticalLineClassNamesForTime expects
            nextTime.unix() * 1000 - 1,
          );
        }
        // TODO: rename or remove class that has reference to vertical-line
        const classNames =
          "rct-vl" +
          (firstOfType ? " rct-vl-first" : "") +
          (minUnit === "day" || minUnit === "hour" || minUnit === "minute"
            ? ` rct-day-${time.day()} `
            : " ") +
          " " +
          (lines.length % 2 ? "rct-vl-even" : "") +
          " " +
          classNamesForTime.join(" ");

        const left = getLeftOffsetFromDate(time.valueOf());
        const right = getLeftOffsetFromDate(nextTime.valueOf());
        lines.push(
          <div
            key={`line-${time.valueOf()}`}
            className={classNames}
            style={{
              pointerEvents: "none",
              top: "0px",
              left: `${left}px`,
              width: `${right - left}px`,
              height: `${height}px`,
            }}
          />,
        );
      },
    );

    return <div className="rct-vertical-lines">{lines}</div>;
  }
}

const ColumnsWrapper = ({ ...props }: passThroughPropTypes) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => (
        <Columns {...props} getLeftOffsetFromDate={getLeftOffsetFromDate} />
      )}
    </TimelineStateConsumer>
  );
};

export default ColumnsWrapper;
