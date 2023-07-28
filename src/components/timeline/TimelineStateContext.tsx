import React, { createContext } from "react";
import { calculateXPositionForTime } from "../utility/calendar";
import { defaultTimeSteps } from "../defaultProps";

/* this context will hold all information regarding timeline state:
  1. timeline width
  2. visible time start and end
  3. canvas time start and end
  4. helpers for calculating left offset of items (and really...anything)
*/

/* eslint-disable no-console */
const defaultContextState = {
  getTimelineState: () => {
    console.warn('"getTimelineState" default func is being used');
    return {
      timelineUnit: "month",
    };
  },
  getLeftOffsetFromDate: (e: any) => {
    console.warn('"getLeftOffsetFromDate" default func is being used');
    return 0;
  },
  showPeriod: (from: any, to: any) => {
    console.warn('"showPeriod" default func is being used');
  },
};
/* eslint-enable */
type propTypes = {
  children: React.ReactNode;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  canvasTimeStart: number;
  canvasTimeEnd: number;
  canvasWidth: number;
  showPeriod: (from: any, to: any) => void;
  timelineUnit: keyof typeof defaultTimeSteps;
  timelineWidth: number;
};

const { Consumer, Provider } = createContext(defaultContextState);

export class TimelineStateProvider extends React.Component<
  propTypes,
  { timelineContext: typeof defaultContextState }
> {
  constructor(props: propTypes) {
    super(props);

    this.state = {
      timelineContext: {
        getTimelineState: this.getTimelineState,
        getLeftOffsetFromDate: this.getLeftOffsetFromDate,
        showPeriod: this.props.showPeriod,
      },
    };
  }

  getTimelineState = () => {
    const {
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      timelineUnit,
      timelineWidth,
    } = this.props;
    return {
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      timelineUnit,
      timelineWidth,
    }; // REVIEW,
  };

  getLeftOffsetFromDate = (date: any) => {
    const { canvasTimeStart, canvasTimeEnd, canvasWidth } = this.props;
    return calculateXPositionForTime(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      date,
    );
  };

  render() {
    return (
      <Provider value={this.state.timelineContext}>
        {this.props.children}
      </Provider>
    );
  }
}

export const TimelineStateConsumer = Consumer;
