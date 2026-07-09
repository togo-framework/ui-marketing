import type { Meta, StoryObj } from "@storybook/react";
import { TypingTerminal } from "../index";

const meta: Meta<typeof TypingTerminal> = {
  title: "Marketing/TypingTerminal",
  component: TypingTerminal,
  parameters: { layout: "padded" },
  argTypes: {
    typeMs: { control: { type: "number" } },
    lineMs: { control: { type: "number" } },
    loop: { control: "boolean" },
    height: { control: { type: "number" } },
  },
};
export default meta;
type Story = StoryObj<typeof TypingTerminal>;

const STEPS = [
  { cmd: "curl -fsSL https://to-go.dev/install.sh | sh", out: ["  installing togo …", "  ✓ togo installed → /usr/local/bin/togo"] },
  { cmd: "togo new fort", out: ["  ? Frontend   ›  TanStack", "  ? Database   ›  PostgreSQL", "  ✓ scaffolded fort/ — Go API + React UI · one repo"] },
  { cmd: "cd fort && togo make:resource Post title:string body:text", out: ["  ✓ model · queries · migration · GraphQL · REST · UI page"] },
  { cmd: "togo generate && togo migrate && togo serve", out: ["  → sqlc · gqlgen · atlas · OpenAPI  ✓", "  → database migrated  ✓", "  → listening on http://localhost:8080"] },
];

export const Default: Story = {
  args: { steps: STEPS, title: "~/myapp — togo", typeMs: 26, lineMs: 110, loop: false, height: 360 },
};

export const WithEndSlot: Story = {
  args: {
    steps: STEPS,
    height: 360,
    endSlot: (
      <div className="rounded-lg border border-white/10 bg-[#0b0f13] p-4 text-sm text-muted-foreground font-mono">
        ▸ app running at localhost:8080/posts
      </div>
    ),
  },
};

export const Looping: Story = { args: { steps: STEPS, loop: true, height: 320 } };
