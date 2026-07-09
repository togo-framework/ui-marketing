import type { Meta, StoryObj } from "@storybook/react";
import { MascotMark } from "../index";

const meta: Meta<typeof MascotMark> = {
  title: "Marketing/MascotMark",
  component: MascotMark,
  parameters: { layout: "centered" },
  argTypes: { src: { control: "text" }, alt: { control: "text" } },
};
export default meta;
type Story = StoryObj<typeof MascotMark>;

export const Default: Story = {
  args: { src: "/togo-storybook-logo.svg", alt: "ToGO" },
  render: (args) => (
    <div className="grid place-items-center p-12">
      <MascotMark {...args} className="w-44 h-auto" />
      <p className="mt-6 text-xs text-muted-foreground">Move your cursor near the mascot — its eyes follow.</p>
    </div>
  ),
};
