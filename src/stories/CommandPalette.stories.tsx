import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette } from "../index";

const meta: Meta<typeof CommandPalette> = {
  title: "Docs/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  args: {
    placeholder: "Search docs & plugins…",
    items: [
      { label: "Introduction", sublabel: "Getting started", href: "/docs", group: "Docs" },
      { label: "make:resource", sublabel: "Generators", href: "/docs/make-resource", group: "Docs" },
      { label: "auth", sublabel: "JWT + RBAC + OTP/2FA", href: "/plugins/auth", group: "Plugins" },
      { label: "dashboard", sublabel: "Admin UI", href: "/plugins/dashboard", group: "Plugins" },
    ],
  },
};
