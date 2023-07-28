import React from "react";

type propTypes = {
  item: any;
  itemContext: any;
  getItemProps: any;
};

export const defaultItemRenderer = ({
  item,
  itemContext,
  getItemProps,
}: propTypes) => {
  //
  return (
    <div {...getItemProps(item.itemProps)}>
      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
      ></div>
    </div>
  );
};
