import type { Meta, StoryObj } from "@storybook/react";
import { AuroraBackground } from "../index";

const meta: Meta<typeof AuroraBackground> = {
  title: "Marketing/AuroraBackground",
  component: AuroraBackground,
  parameters: { layout: "fullscreen" },
  argTypes: { intensity: { control: { type: "range", min: 0, max: 1, step: 0.05 } } },
};
export default meta;
type Story = StoryObj<typeof AuroraBackground>;

export const Default: Story = {
  args: { intensity: 0.5 },
  render: (args) => (
    <div className="relative min-h-[60vh] bg-background overflow-hidden">
      <div className="absolute inset-0"><AuroraBackground {...args} /></div>
      <div className="relative z-10 grid place-items-center min-h-[60vh] text-center">
        <p className="font-mono text-sm text-muted-foreground">Animated aurora backdrop (used site-wide on to-go.dev)</p>
      </div>
    </div>
  ),
};
