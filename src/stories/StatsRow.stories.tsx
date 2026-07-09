import type { Meta, StoryObj } from "@storybook/react";
import { StatsRow } from "../index";

const meta: Meta<typeof StatsRow> = {
  title: "Marketplace/StatsRow",
  component: StatsRow,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof StatsRow>;

export const Default: Story = {
  args: { stats: [{ label: "Plugins", value: 35 }, { label: "Categories", value: 6 }, { label: "Downloads", value: "12.4k" }] },
};
