import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterBar } from "../index";

const meta: Meta<typeof FilterBar> = {
  title: "Marketplace/FilterBar",
  component: FilterBar,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

const CHIPS = [
  { value: "all", label: "All", count: 35 },
  { value: "auth", label: "Auth", count: 7 },
  { value: "data", label: "Data & Storage", count: 10 },
  { value: "infra", label: "Infrastructure", count: 7 },
];

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    const [active, setActive] = useState("all");
    const [sort, setSort] = useState("name");
    return (
      <FilterBar
        search={search}
        onSearch={setSearch}
        chips={CHIPS}
        active={active}
        onChip={setActive}
        sort={{ value: sort, onSort: setSort, options: [{ value: "name", label: "Name" }, { value: "stars", label: "Stars" }, { value: "downloads", label: "Downloads" }] }}
      />
    );
  },
};
