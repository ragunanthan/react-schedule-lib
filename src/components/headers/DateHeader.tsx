import React from "react";
import { TimelineStateConsumer } from "../timeline/TimelineStateContext";
import CustomHeader from "./CustomHeader";
import { getNextUnit } from "../utility/calendar";
import memoize from "memoize-one";
import { CustomDateHeader } from "./CustomDateHeader";
import { defaultHeaderFormats, defaultTimeSteps } from "../defaultProps";
import { Moment } from "moment";

type propTypes = {
  unit?: string;
  style?: {};
  className?: string;
  timelineUnit?: any;
  intervalRenderer?: () => void;
  headerData?: {};
  height?: number;
  timeSteps: {};
};

class DateHeader extends React.Component<propTypes> {
  getHeaderUnit = () => {
    if (this.props.unit === "primaryHeader") {
      return getNextUnit(this.props.timelineUnit);
    } else if (this.props.unit) {
      return this.props.unit;
    }
    return this.props.timelineUnit;
  };

  getRootStyle = memoize((style) => {
    return {
      height: 30,
      ...style,
    };
  });

  getLabelFormat = (interval: any, unit: any, labelWidth: any) => {
    return formatLabel(interval, unit, labelWidth);
  };

  getHeaderData = memoize(
    (
      intervalRenderer,
      style,
      className,
      getLabelFormat,
      unitProp,
      headerData,
    ) => {
      return {
        intervalRenderer,
        style,
        className,
        getLabelFormat,
        unitProp,
        headerData,
      };
    },
  );

  render() {
    const unit = this.getHeaderUnit();
    const { headerData, height, timeSteps } = this.props;
    return (
      <CustomHeader
        unit={unit}
        height={height}
        headerData={this.getHeaderData(
          this.props.intervalRenderer,
          this.getRootStyle(this.props.style),
          this.props.className,
          this.getLabelFormat,
          this.props.unit,
          this.props.headerData,
        )}
        timeSteps={timeSteps}
        render={CustomDateHeader}
      />
    );
  }
}

function formatLabel(
  [timeStart, timeEnd]: Moment[],
  unit: keyof typeof defaultTimeSteps,
  labelWidth: number,
  formatOptions = defaultHeaderFormats,
) {
  let format;
  if (labelWidth >= 150) {
    format = formatOptions[unit]["long"];
  } else if (labelWidth >= 100) {
    format = formatOptions[unit]["mediumLong"];
  } else if (labelWidth >= 50) {
    format = formatOptions[unit]["medium"];
  } else {
    format = formatOptions[unit]["short"];
  }
  return timeStart.format(format);
}

const DateHeaderWrapper = ({
  unit,
  style,
  className,
  intervalRenderer,
  headerData,
  height,
  timeSteps,
}: propTypes) => (
  <TimelineStateConsumer>
    {({ getTimelineState }) => {
      const timelineState = getTimelineState();

      return (
        <DateHeader
          timelineUnit={timelineState.timelineUnit}
          unit={unit}
          style={style}
          className={className}
          intervalRenderer={intervalRenderer}
          headerData={headerData}
          height={height}
          timeSteps={timeSteps}
        />
      );
    }}
  </TimelineStateConsumer>
);

export default DateHeaderWrapper;
