import React from "react";
import { getNextUnit } from "../utility/calendar";
import { composeEvents } from "../utility/events";
import { Moment } from "moment";
import { defaultTimeSteps } from "../defaultProps";
type propTypes = {
  unit: keyof typeof defaultTimeSteps;
  interval: {
    startTime: Moment;
    endTime: Moment;
  };
  showPeriod: (start: Moment, end: Moment) => void;
  intervalText: string;
  primaryHeader: boolean;
  getIntervalProps: ({ interval }: any) => {};
};
class Interval extends React.PureComponent<propTypes> {
  onIntervalClick = () => {
    const { primaryHeader, interval, unit, showPeriod } = this.props;
    if (primaryHeader) {
      const nextUnit = getNextUnit(unit);
      const newStartTime = interval.startTime.clone().startOf(nextUnit);
      const newEndTime = interval.startTime.clone().endOf(nextUnit);
      showPeriod(newStartTime, newEndTime);
    } else {
      showPeriod(interval.startTime, interval.endTime);
    }
  };

  getIntervalProps = (props: any = {}) => {
    return {
      ...this.props.getIntervalProps({
        interval: this.props.interval,
        ...props,
      }),
      onClick: composeEvents(this.onIntervalClick, props.onClick),
    };
  };

  render() {
    const { intervalText } = this.props;

    return (
      <div
        data-testid="dateHeaderInterval"
        {...this.getIntervalProps({})}
        className={`rct-dateHeader ${
          this.props.primaryHeader ? "rct-dateHeader-primary" : ""
        }`}
      >
        <span>{intervalText}</span>
      </div>
    );
  }
}

export default Interval;
