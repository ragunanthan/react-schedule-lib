import React from "react";

type propTypes = {
  leftSidebarWidth: number;
};
export default class SidebarHeader extends React.PureComponent<propTypes> {
  getRootProps = (props: any = {}) => {
    const { style } = props;
    const width = this.props.leftSidebarWidth;
    return {
      style: {
        ...style,
        width,
      },
    };
  };

  render() {
    return <div data-testid="sidebarHeader" {...this.getRootProps()} />;
  }
}
