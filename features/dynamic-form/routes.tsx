import { RouteGuard } from "@/shared/components/navigation/RouteGuard";
import type { RouteObject } from "react-router-dom";

export const dynamicFormRoutes: RouteObject[] = [
  {
    path: "sample/dynamic-form",
    lazy: async () => {
      const module = await import("@/pages/SampleDynamicFormPage");
      return {
        Component: () => (
          <RouteGuard>
            <module.SampleDynamicFormPage />
          </RouteGuard>
        ),
      };
    },
  },
];
