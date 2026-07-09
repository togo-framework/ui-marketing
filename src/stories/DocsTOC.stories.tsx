import type { Meta, StoryObj } from "@storybook/react";
import { DocsTOC } from "../index";

const meta: Meta<typeof DocsTOC> = {
  title: "Docs/DocsTOC",
  component: DocsTOC,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof DocsTOC>;

export const Default: Story = {
  args: {
    items: [
      { id: "overview", text: "Overview", level: 2 },
      { id: "install", text: "Installation", level: 2 },
      { id: "macos", text: "macOS", level: 3 },
      { id: "linux", text: "Linux", level: 3 },
      { id: "next", text: "Next steps", level: 2 },
    ],
  },
  render: (args) => <div className="w-56"><DocsTOC {...args} /></div>,
};
