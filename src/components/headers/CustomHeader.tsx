import React from "react";
import { TimelineStateConsumer } from "../timeline/TimelineStateContext";
import { iterateTimes } from "../utility/calendar";
import { defaultTimeSteps } from "../defaultProps";
import { Moment } from "moment";

type propTypes = {
  render: (e: any) => React.ReactNode;
  unit: any;
  timeSteps: any;

  headerData: {};

  height: number;
};

type interValType = {
  startTime: Moment;
  endTime: Moment;
  labelWidth: number;
  left: number;
}[];

type combineContextType = propTypes & {
  showPeriod: (from: any, to: any) => void;
  timelineWidth: number;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  canvasTimeStart: number;
  canvasTimeEnd: number;
  getLeftOffsetFromDate: (e: number) => number;
  canvasWidth: number;
};

export class CustomHeader extends React.Component<
  combineContextType,
  { intervals: interValType }
> {
  constructor(props: combineContextType) {
    super(props);
    const {
      canvasTimeStart,
      canvasTimeEnd,
      unit,
      timeSteps,
      getLeftOffsetFromDate,
    } = props;

    const intervals = this.getHeaderIntervals({
      canvasTimeStart,
      canvasTimeEnd,
      unit,
      timeSteps,
      getLeftOffsetFromDate,
    });

    this.state = {
      intervals,
    };
  }

  shouldComponentUpdate(nextProps: any) {
    if (
      nextProps.canvasTimeStart !== this.props.canvasTimeStart ||
      nextProps.canvasTimeEnd !== this.props.canvasTimeEnd ||
      nextProps.canvasWidth !== this.props.canvasWidth ||
      nextProps.unit !== this.props.unit ||
      nextProps.timeSteps !== this.props.timeSteps ||
      nextProps.showPeriod !== this.props.showPeriod ||
      nextProps.render !== this.props.render ||
      nextProps.headerData !== this.props.headerData
    ) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.canvasTimeStart !== this.props.canvasTimeStart ||
      nextProps.canvasTimeEnd !== this.props.canvasTimeEnd ||
      nextProps.canvasWidth !== this.props.canvasWidth ||
      nextProps.unit !== this.props.unit ||
      nextProps.timeSteps !== this.props.timeSteps ||
      nextProps.showPeriod !== this.props.showPeriod
    ) {
      const {
        canvasTimeStart,
        canvasTimeEnd,
        unit,
        timeSteps,
        getLeftOffsetFromDate,
      } = nextProps;

      const intervals = this.getHeaderIntervals({
        canvasTimeStart,
        canvasTimeEnd,
        unit,
        timeSteps,
        getLeftOffsetFromDate,
      });

      this.setState({ intervals });
    }
  }

  getHeaderIntervals = ({
    canvasTimeStart,
    canvasTimeEnd,
    unit,
    timeSteps,
    getLeftOffsetFromDate,
  }: {
    canvasTimeStart: number;
    canvasTimeEnd: number;
    unit: keyof typeof defaultTimeSteps;
    timeSteps: typeof defaultTimeSteps;
    getLeftOffsetFromDate: (e: number) => number;
  }) => {
    const intervals: interValType = [];
    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      unit,
      timeSteps,
      (startTime, endTime) => {
        const left: number = getLeftOffsetFromDate(startTime.valueOf());
        const right: number = getLeftOffsetFromDate(endTime.valueOf());
        const width = right - left;
        intervals.push({
          startTime,
          endTime,
          labelWidth: width,
          left,
        });
      },
    );
    return intervals;
  };

  getRootProps = (props: any = {}) => {
    const { style } = props;
    return {
      style: Object.assign({}, style ? style : {}, {
        position: "relative",
        width: this.props.canvasWidth,
        height: this.props.height,
      }),
    };
  };

  getIntervalProps = (props: any = {}) => {
    const { interval, style } = props;
    if (!interval)
      throw new Error("you should provide interval to the prop getter");
    const { startTime, labelWidth, left } = interval;
    return {
      style: this.getIntervalStyle({
        style,
        startTime,
        labelWidth,
        canvasTimeStart: this.props.canvasTimeStart,
        unit: this.props.unit,
        left,
      }),
      key: `label-${startTime.valueOf()}`,
    };
  };

  getIntervalStyle = ({ left, labelWidth, style }: any) => {
    return {
      ...style,
      left,
      width: labelWidth,
      position: "absolute",
    };
  };

  getStateAndHelpers = () => {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      unit,
      showPeriod,
      timelineWidth,
      visibleTimeStart,
      visibleTimeEnd,
      headerData,
    } = this.props;
    //TODO: only evaluate on changing params
    return {
      timelineContext: {
        timelineWidth,
        visibleTimeStart,
        visibleTimeEnd,
        canvasTimeStart,
        canvasTimeEnd,
      },
      headerContext: {
        unit,
        intervals: this.state.intervals,
      },
      getRootProps: this.getRootProps,
      getIntervalProps: this.getIntervalProps,
      showPeriod,
      data: headerData,
    };
  };

  render() {
    const props = this.getStateAndHelpers();
    const Renderer: any = this.props.render;
    return <Renderer {...props} />;
  }
}

const CustomHeaderWrapper = ({
  render,
  unit,
  headerData,
  height,
  timeSteps,
}: propTypes) => (
  <TimelineStateConsumer>
    {({ getTimelineState, showPeriod, getLeftOffsetFromDate }) => {
      const timelineState = getTimelineState();
      return (
        <CustomHeader
          visibleTimeStart={0}
          visibleTimeEnd={0}
          canvasTimeStart={0}
          canvasTimeEnd={0}
          canvasWidth={0}
          timelineWidth={0}
          render={render}
          timeSteps={timeSteps}
          showPeriod={showPeriod}
          unit={unit}
          {...timelineState}
          headerData={headerData}
          getLeftOffsetFromDate={getLeftOffsetFromDate}
          height={height}
        />
      );
    }}
  </TimelineStateConsumer>
);

CustomHeaderWrapper.defaultProps = {
  height: 30,
};

export default CustomHeaderWrapper;
