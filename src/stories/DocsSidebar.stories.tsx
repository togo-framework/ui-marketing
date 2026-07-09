import type { Meta, StoryObj } from "@storybook/react";
import { DocsSidebar } from "../index";

const meta: Meta<typeof DocsSidebar> = {
  title: "Docs/DocsSidebar",
  component: DocsSidebar,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof DocsSidebar>;

const GROUPS = [
  { label: "Getting started", items: [{ label: "Introduction", href: "/docs" }, { label: "Installation", href: "/docs/install" }, { label: "togo new", href: "/docs/new" }] },
  { label: "Generators", items: [{ label: "make:resource", href: "/docs/make-resource" }, { label: "generate", href: "/docs/generate" }, { label: "migrate", href: "/docs/migrate" }] },
  { label: "Plugins", items: [{ label: "Installing plugins", href: "/docs/install-plugins" }, { label: "Writing a plugin", href: "/docs/write-plugin" }] },
];

export const Default: Story = {
  args: { groups: GROUPS, activeHref: "/docs/make-resource" },
  render: (args) => <div className="w-64"><DocsSidebar {...args} /></div>,
};
