import type { Meta, StoryObj } from "@storybook/react";
import { DocsLayout, DocsSidebar, DocsTOC, Callout } from "../index";

const meta: Meta<typeof DocsLayout> = {
  title: "Docs/DocsLayout",
  component: DocsLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof DocsLayout>;

const GROUPS = [
  { label: "Getting started", items: [{ label: "Introduction", href: "/docs" }, { label: "Installation", href: "/docs/install" }] },
  { label: "Generators", items: [{ label: "make:resource", href: "/docs/make-resource" }, { label: "generate", href: "/docs/generate" }] },
];
const TOC = [{ id: "overview", text: "Overview", level: 2 }, { id: "usage", text: "Usage", level: 2 }];

export const Default: Story = {
  render: () => (
    <DocsLayout
      sidebar={<DocsSidebar groups={GROUPS} activeHref="/docs/install" />}
      toc={<DocsTOC items={TOC} />}
      breadcrumb={<span>Docs / Getting started / Installation</span>}
    >
      <article className="prose-invert">
        <h1 id="overview" className="text-2xl font-bold mb-3">Installation</h1>
        <p className="text-muted-foreground mb-4">Install the togo CLI with a single command, then scaffold your first app.</p>
        <Callout kind="tip" title="Tip">The installer auto-installs Go, Node, sqlc and Atlas if they're missing.</Callout>
        <h2 id="usage" className="text-lg font-semibold mt-6 mb-2">Usage</h2>
        <p className="text-muted-foreground">Run <code>togo new myapp</code> to get started.</p>
      </article>
    </DocsLayout>
  ),
};
