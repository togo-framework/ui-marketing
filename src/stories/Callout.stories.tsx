import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "../index";

const meta: Meta<typeof Callout> = {
  title: "Docs/Callout",
  component: Callout,
  parameters: { layout: "padded" },
  argTypes: { kind: { control: "select", options: ["info", "warn", "tip", "note"] } },
};
export default meta;
type Story = StoryObj<typeof Callout>;

export const Info: Story = { args: { kind: "info", title: "Heads up", children: "togo generate runs sqlc → gqlgen → atlas → OpenAPI in order." } };
export const Warn: Story = { args: { kind: "warn", title: "Careful", children: "A destructive migration diff needs --auto-approve." } };
export const Tip: Story = { args: { kind: "tip", title: "Tip", children: "Use togo make:resource — never hand-write entities." } };
export const Note: Story = { args: { kind: "note", children: "Registries (*.gen.go) are regenerated from the manifest — don't edit them." } };

export const AllKinds: Story = {
  render: () => (
    <div className="space-y-3 max-w-2xl">
      <Callout kind="info" title="Info">Informational context.</Callout>
      <Callout kind="warn" title="Warning">Something to watch out for.</Callout>
      <Callout kind="tip" title="Tip">A helpful shortcut.</Callout>
      <Callout kind="note">A side note without a title.</Callout>
    </div>
  ),
};
