import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SectionBoard, type SectionModel } from "../components/sections/SectionBoard";

const meta: Meta<typeof SectionBoard> = {
  title: "Components/Dynamic Sections",
  component: SectionBoard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dynamic editable sections (as on sentra narrative/alerts pages). In edit mode each " +
          "section is drag-reorderable and its prompt / model / settings are editable via a dialog. " +
          "View mode renders content only. Presentational: pass `sections` + `onChange`.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SectionBoard>;

const MODELS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "claude-opus-4", label: "Claude Opus 4" },
];

const SAMPLE: SectionModel[] = [
  { id: "s1", title: "Executive Brief", badge: "AI", model: "gemini-2.5-pro", prompt: "Summarize the narrative in 3 bullet points for a non-technical executive.", content: "A 23% rise in coordinated activity across monitored regions, concentrated in two source clusters." },
  { id: "s2", title: "Source Landscape", badge: "Live", model: "gemini-2.5-flash", prompt: "List the top sources contributing to this narrative with reach.", content: "Reuters · AFP · Al Jazeera — 1,284 mentions across 342 unique authors." },
  { id: "s3", title: "Recommended Actions", model: "claude-opus-4", prompt: "Propose 3 concrete next steps with rationale.", content: "1) Escalate to the regional desk. 2) Open a watchlist. 3) Brief stakeholders by EOD." },
];

export const ViewMode: Story = {
  args: { sections: SAMPLE, models: MODELS, language: "en", editMode: false, columns: 2 },
};

export const EditMode: Story = {
  name: "Edit mode — reorder + edit prompt/model/settings",
  render: () => {
    const [sections, setSections] = useState<SectionModel[]>(SAMPLE);
    return (
      <SectionBoard
        sections={sections}
        editMode
        models={MODELS}
        language="en"
        onChange={setSections}
        onAddSection={() =>
          setSections((s) => [...s, { id: `s${s.length + 1}-${Date.now()}`, title: "New section", prompt: "", model: MODELS[0].value }])
        }
      />
    );
  },
};

export const EditModeRTL: Story = {
  name: "Edit mode — Arabic / RTL",
  render: () => {
    const [sections, setSections] = useState<SectionModel[]>(
      SAMPLE.map((s, i) => ({ ...s, title: ["الموجز التنفيذي", "مصادر المحتوى", "الإجراءات الموصى بها"][i] })),
    );
    return <SectionBoard sections={sections} editMode models={MODELS} language="ar" onChange={setSections} onAddSection={() => {}} />;
  },
};
