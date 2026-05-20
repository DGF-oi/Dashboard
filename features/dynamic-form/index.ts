import type { FeatureDefinition } from "@/app/types/feature";
import { dynamicFormRoutes } from "@/features/dynamic-form/routes";

const dynamicFormFeature: FeatureDefinition = {
  key: "dynamic-form",
  routes: dynamicFormRoutes,
};

export default dynamicFormFeature;
