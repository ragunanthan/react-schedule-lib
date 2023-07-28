import React, { Component } from "react";

type propTypes = {
  children: React.ReactNode;
  width: number;
  height: number;
  scrollRef: Function;
};

class ScrollElement extends Component<propTypes> {
  private refHandler = (el: any) => {
    this.props.scrollRef(el);
  };

  render() {
    const { width, height, children } = this.props;

    return (
      <div
        ref={this.refHandler}
        data-testid="scroll-element"
        className="rct-scroll"
        style={{
          width: `${width}px`,
          height: `${height + 20}px`,
          cursor: "default",
          position: "relative",
        }}
      >
        {children}
      </div>
    );
  }
}

export default ScrollElement;
