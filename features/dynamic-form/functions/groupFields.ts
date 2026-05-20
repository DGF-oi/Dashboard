import type { FormField, FormSection, GroupedFieldSection } from "@/features/dynamic-form/types/form";

const FALLBACK_SECTION_KEY = "_default_section";

const compareByOrder = <T extends { order?: number }>(left: T, right: T) => {
  return (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
};

export const groupFields = (sections: FormSection[], fields: FormField[]): GroupedFieldSection[] => {
  const sectionMap = new Map<string, FormSection>();

  sections.forEach((section) => {
    sectionMap.set(section.key, section);
  });

  const fallbackSection: FormSection = {
    key: FALLBACK_SECTION_KEY,
    label: "General",
    order: Number.MAX_SAFE_INTEGER,
  };

  const groupedMap = new Map<string, FormField[]>();

  fields
    .slice()
    .sort(compareByOrder)
    .forEach((field) => {
      const sectionKey = field.section && sectionMap.has(field.section) ? field.section : FALLBACK_SECTION_KEY;
      const current = groupedMap.get(sectionKey) ?? [];
      groupedMap.set(sectionKey, [...current, field]);
    });

  const existingSections = sections
    .slice()
    .sort(compareByOrder)
    .filter((section) => groupedMap.has(section.key))
    .map((section) => ({
      section,
      fields: (groupedMap.get(section.key) ?? []).slice().sort(compareByOrder),
    }));

  const fallbackFields = groupedMap.get(FALLBACK_SECTION_KEY);
  if (!fallbackFields || fallbackFields.length === 0) {
    return existingSections;
  }

  return [
    ...existingSections,
    {
      section: fallbackSection,
      fields: fallbackFields.slice().sort(compareByOrder),
    },
  ];
};