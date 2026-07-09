import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading, FeatureCard, CodeShowcase, Eyebrow } from "../components/marketing/Marketing";
import { Boxes, Sparkles, TerminalSquare, Workflow } from "lucide-react";

const meta: Meta = {
  title: "Marketing/Components",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

export const Heading: Story = {
  render: () => (
    <SectionHeading
      eyebrow="Generators first"
      eyebrowIcon={Workflow}
      title="One command. Every layer."
      subtitle="make:resource emits the model, queries, GraphQL, REST and UI page — then regenerates the registries."
    />
  ),
};

export const Features: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FeatureCard icon={Boxes} title="One repo, one binary">Your Go API and React UI compile into a single deployable artifact.</FeatureCard>
      <FeatureCard icon={TerminalSquare} title="artisan-grade CLI"><code>togo new</code>, <code>make:resource</code>, <code>migrate</code>, <code>serve</code>.</FeatureCard>
      <FeatureCard icon={Sparkles} title="AI-native">Every app ships a <code>.claude/</code> tree + a pre-wired MCP server.</FeatureCard>
    </div>
  ),
};

export const Code: Story = {
  render: () => (
    <CodeShowcase
      tabs={[
        { key: "model", label: "Model", lang: "go", file: "internal/models/post.go", code: "type Post struct {\n  ID    uuid.UUID `json:\"id\"`\n  Title string    `json:\"title\"`\n}" },
        { key: "rest", label: "REST", lang: "bash", code: "$ curl https://api.example.com/posts\n[{\"id\":\"…\",\"title\":\"Hello\"}]" },
        { key: "gql", label: "GraphQL", lang: "graphql", code: "type Post {\n  id: ID!\n  title: String!\n}" },
      ]}
    />
  ),
};

export const EyebrowOnly: Story = {
  render: () => <Eyebrow icon={Sparkles}>Open-source · Full-stack · One binary</Eyebrow>,
};
