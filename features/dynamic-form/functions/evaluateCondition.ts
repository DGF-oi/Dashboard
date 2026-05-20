import type { Condition, ConditionLeaf, FormValues, Primitive } from "@/features/dynamic-form/types/form";

const isGroupCondition = (condition: Condition): condition is { and?: Condition[]; or?: Condition[] } => {
  return "and" in condition || "or" in condition;
};

const toComparableNumber = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

const compareLeaf = (values: FormValues, leaf: ConditionLeaf) => {
  const fieldValue = values[leaf.field];

  if (leaf.eq !== undefined) {
    return fieldValue === leaf.eq;
  }

  if (leaf.ne !== undefined) {
    return fieldValue !== leaf.ne;
  }

  if (leaf.in !== undefined) {
    return leaf.in.includes(fieldValue as Primitive);
  }

  if (leaf.gt !== undefined) {
    const actual = toComparableNumber(fieldValue);
    const expected = toComparableNumber(leaf.gt);
    return actual !== null && expected !== null && actual > expected;
  }

  if (leaf.gte !== undefined) {
    const actual = toComparableNumber(fieldValue);
    const expected = toComparableNumber(leaf.gte);
    return actual !== null && expected !== null && actual >= expected;
  }

  if (leaf.lt !== undefined) {
    const actual = toComparableNumber(fieldValue);
    const expected = toComparableNumber(leaf.lt);
    return actual !== null && expected !== null && actual < expected;
  }

  if (leaf.lte !== undefined) {
    const actual = toComparableNumber(fieldValue);
    const expected = toComparableNumber(leaf.lte);
    return actual !== null && expected !== null && actual <= expected;
  }

  return true;
};

export const evaluateCondition = (values: FormValues, condition: Condition): boolean => {
  if (isGroupCondition(condition)) {
    if (condition.and) {
      return condition.and.every((child) => evaluateCondition(values, child));
    }

    if (condition.or) {
      return condition.or.some((child) => evaluateCondition(values, child));
    }

    return true;
  }

  return compareLeaf(values, condition);
};