import type { Meta, StoryObj } from "@storybook/react";
import { ShieldCheck } from "lucide-react";
import { MarketplaceCard } from "../index";

const meta: Meta<typeof MarketplaceCard> = {
  title: "Marketplace/MarketplaceCard",
  component: MarketplaceCard,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof MarketplaceCard>;

export const Default: Story = {
  args: {
    name: "auth",
    href: "#",
    category: "Auth",
    categoryColor: "#2D8CE6",
    icon: ShieldCheck,
    description: "JWT + RBAC + multi-guard, Supabase/GoTrue first-class, OTP/2FA.",
    author: "togo-framework",
    stars: 128,
    downloads: 4200,
  },
  render: (args) => <div className="w-80"><MarketplaceCard {...args} /></div>,
};

export const Enabled: Story = {
  args: { ...Default.args, enabled: true, name: "dashboard", category: "UI & i18n", categoryColor: "#1FC7DC" },
  render: (args) => <div className="w-80"><MarketplaceCard {...args} /></div>,
};
