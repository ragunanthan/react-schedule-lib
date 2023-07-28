import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import TimeLine from "./Demo";
import moment from "moment";

const meta: Meta<typeof TimeLine> = {
  component: TimeLine,
  title: "Marbella/TimeLine",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof TimeLine>;

export const Primary: Story = (args) => (
  <TimeLine data-test-id="InputField-id" {...args} />
);
