import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pager } from "../index";

const meta: Meta<typeof Pager> = {
  title: "Marketplace/Pager",
  component: Pager,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Pager>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pager page={page} pages={8} onPage={setPage} />;
  },
};
