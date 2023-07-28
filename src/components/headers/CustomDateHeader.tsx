import React from "react";
import Interval from "./Interval";
export function CustomDateHeader({
  headerContext: { intervals, unit },
  getRootProps,
  getIntervalProps,
  showPeriod,
  data: { style, className, getLabelFormat, unitProp, headerData },
}: {
  headerContext: { intervals: any; unit: any };
  getRootProps: any;
  getIntervalProps: any;
  showPeriod: any;
  data: {
    style: any;
    className: string;
    getLabelFormat: any;
    unitProp: any;
    headerData: any;
  };
}) {
  return (
    <div
      data-testid={`dateHeader`}
      className={className}
      {...getRootProps({ style })}
    >
      {intervals.map((interval: any) => {
        const intervalText = getLabelFormat(
          [interval.startTime, interval.endTime],
          unit,
          interval.labelWidth,
        );
        return (
          <Interval
            key={`label-${interval.startTime.valueOf()}`}
            unit={unit}
            interval={interval}
            showPeriod={showPeriod}
            intervalText={intervalText}
            primaryHeader={unitProp === "primaryHeader"}
            getIntervalProps={getIntervalProps}
          />
        );
      })}
    </div>
  );
}
