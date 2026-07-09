"use client";

import * as React from "react";
import {
  DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings2, Trash2, Plus } from "lucide-react";
import { cn } from "@togo-framework/ui-core";
import { Card } from "@togo-framework/ui-core";
import { Badge } from "@togo-framework/ui-core";
import { Button } from "@togo-framework/ui-core";
import { Label } from "@togo-framework/ui-core";
import { Input } from "@togo-framework/ui-core";
import { Textarea } from "@togo-framework/ui-core";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@togo-framework/ui-core";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@togo-framework/ui-core";

export interface ModelOption {
  value: string;
  label?: string;
}

export interface SectionModel {
  id: string;
  title: string;
  badge?: string;
  /** AI prompt that powers this section (edited in edit mode). */
  prompt?: string;
  /** Selected model id. */
  model?: string;
  /** Arbitrary key/value settings. */
  settings?: Record<string, string>;
  /** Rendered content in view mode. */
  content?: React.ReactNode;
}

const T = {
  en: {
    edit: "Edit section", prompt: "Prompt", model: "Model", settings: "Settings",
    addSetting: "Add setting", key: "Key", value: "Value", save: "Save", cancel: "Cancel",
    addSection: "Add section", noModel: "Default model", empty: "No content.",
  },
  ar: {
    edit: "تعديل القسم", prompt: "التوجيه", model: "النموذج", settings: "الإعدادات",
    addSetting: "إضافة إعداد", key: "المفتاح", value: "القيمة", save: "حفظ", cancel: "إلغاء",
    addSection: "إضافة قسم", noModel: "النموذج الافتراضي", empty: "لا يوجد محتوى.",
  },
};

// ── Section settings editor (Dialog) ─────────────────────────────────────────
function SectionEditor({
  open, section, models, language, onClose, onSave,
}: {
  open: boolean;
  section: SectionModel;
  models: ModelOption[];
  language: "en" | "ar";
  onClose: () => void;
  onSave: (next: SectionModel) => void;
}) {
  const t = T[language];
  const [draft, setDraft] = React.useState<SectionModel>(section);
  React.useEffect(() => { if (open) setDraft(section); }, [open, section]);

  const settings = Object.entries(draft.settings ?? {});
  const setSetting = (i: number, key: string, value: string) => {
    const next = [...settings];
    next[i] = [key, value];
    setDraft({ ...draft, settings: Object.fromEntries(next.filter(([k]) => k)) });
  };
  const addSetting = () => setDraft({ ...draft, settings: { ...(draft.settings ?? {}), "": "" } });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{draft.title || t.edit}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sec-prompt">{t.prompt}</Label>
            <Textarea
              id="sec-prompt" rows={4}
              value={draft.prompt ?? ""}
              onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t.model}</Label>
            <Select value={draft.model ?? ""} onValueChange={(v) => setDraft({ ...draft, model: v })}>
              <SelectTrigger><SelectValue placeholder={t.noModel} /></SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label ?? m.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.settings}</Label>
            <div className="space-y-2">
              {settings.map(([k, v], i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={t.key} value={k} onChange={(e) => setSetting(i, e.target.value, v)} />
                  <Input placeholder={t.value} value={v} onChange={(e) => setSetting(i, k, e.target.value)} />
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={addSetting}>
                <Plus className="h-3.5 w-3.5" /> {t.addSetting}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>{t.cancel}</Button>
          <Button onClick={() => onSave(draft)}>{t.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── A single section card ────────────────────────────────────────────────────
export interface DynamicSectionProps {
  section: SectionModel;
  editMode?: boolean;
  models?: ModelOption[];
  language?: "en" | "ar";
  onChange?: (section: SectionModel) => void;
  onRemove?: () => void;
  /** Drag handle props (supplied by SectionBoard in edit mode). */
  handleProps?: React.HTMLAttributes<HTMLButtonElement>;
  className?: string;
}

export function DynamicSection({
  section, editMode, models = [], language = "en", onChange, onRemove, handleProps, className,
}: DynamicSectionProps) {
  const t = T[language];
  const [editing, setEditing] = React.useState(false);
  return (
    <Card className={cn("space-y-3 p-4", className)}>
      <div className="flex items-center gap-2">
        {editMode && (
          <button
            type="button"
            aria-label="Drag to reorder"
            className="shrink-0 cursor-grab text-muted-foreground hover:text-foreground"
            {...handleProps}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{section.title}</h3>
        {section.badge && <Badge>{section.badge}</Badge>}
        {editMode && (
          <>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label={t.edit} onClick={() => setEditing(true)}>
              <Settings2 className="h-4 w-4" />
            </Button>
            {onRemove && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" aria-label="Remove" onClick={onRemove}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {section.content ?? <span className="italic opacity-70">{t.empty}</span>}
      </div>

      {editMode && (section.model || section.prompt) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
          {section.model && <Badge variant="outline">{section.model}</Badge>}
          {section.prompt && <span className="line-clamp-1 flex-1 font-mono opacity-70">{section.prompt}</span>}
        </div>
      )}

      <SectionEditor
        open={editing}
        section={section}
        models={models}
        language={language}
        onClose={() => setEditing(false)}
        onSave={(next) => { onChange?.(next); setEditing(false); }}
      />
    </Card>
  );
}

// ── Sortable wrapper ─────────────────────────────────────────────────────────
function SortableSection(props: DynamicSectionProps & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style}>
      <DynamicSection {...props} handleProps={{ ...attributes, ...listeners } as never} />
    </div>
  );
}

// ── The board ────────────────────────────────────────────────────────────────
export interface SectionBoardProps {
  sections: SectionModel[];
  editMode?: boolean;
  models?: ModelOption[];
  language?: "en" | "ar";
  columns?: 1 | 2;
  onChange?: (sections: SectionModel[]) => void;
  onAddSection?: () => void;
  className?: string;
}

/** SectionBoard — an ordered set of dynamic sections. In `editMode` each section is
 * drag-reorderable (@dnd-kit) and editable (prompt / model / settings via a dialog);
 * `onChange` fires on reorder and on per-section edits. View mode renders content only.
 * Token-themed (dark/light), RTL + EN/AR. */
export function SectionBoard({
  sections, editMode, models = [], language = "en", columns = 1, onChange, onAddSection, className,
}: SectionBoardProps) {
  const t = T[language];
  const isRTL = language === "ar";
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const update = (id: string, next: SectionModel) =>
    onChange?.(sections.map((s) => (s.id === id ? next : s)));
  const remove = (id: string) => onChange?.(sections.filter((s) => s.id !== id));

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((s) => s.id === active.id);
    const to = sections.findIndex((s) => s.id === over.id);
    if (from < 0 || to < 0) return;
    onChange?.(arrayMove(sections, from, to));
  };

  const grid = cn("grid gap-3", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1");
  const active = sections.find((s) => s.id === activeId);

  if (!editMode) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className={cn(grid, className)}>
        {sections.map((s) => (
          <DynamicSection key={s.id} section={s} language={language} models={models} />
        ))}
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={cn("space-y-3", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className={grid}>
            {sections.map((s) => (
              <SortableSection
                key={s.id} id={s.id} section={s} editMode models={models} language={language}
                onChange={(next) => update(s.id, next)} onRemove={() => remove(s.id)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {active ? <DynamicSection section={active} editMode models={models} language={language} className="shadow-lg" /> : null}
        </DragOverlay>
      </DndContext>

      {onAddSection && (
        <Button variant="outline" className="w-full border-dashed" onClick={onAddSection}>
          <Plus className="h-4 w-4" /> {t.addSection}
        </Button>
      )}
    </div>
  );
}
