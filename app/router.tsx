// feature ごとの routes を束ねてアプリ全体の router を組み立てます。
import { Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { featureRegistry } from "@/app/registry/featureRegistry";
import { AppShellLayout } from "@/common/components/layouts/AppShellLayout";
import { AuthLayout } from "@/common/components/layouts/AuthLayout";
import { RouteGuard } from "@/shared/components/navigation/RouteGuard";

const HomePage = () => {
  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <p className="eyebrow mb-2">Home</p>
        <h2 className="h4 mb-2">dashss</h2>
        <p className="text-body-secondary mb-0">Select a menu item from the sidebar to continue.</p>
      </div>
    </section>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShellLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...featureRegistry.routes,
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        lazy: async () => {
          const module = await import("@/features/auth/pages/LoginPage");
          return { Component: module.LoginPage };
        },
      },
    ],
  },
  {
    path: "*",
    element: <RouteGuard requireAuth={false}><Navigate to="/" replace /></RouteGuard>,
  },
]);

export const AppRouter = () => {
  return (
    <Suspense fallback={<div className="screen-center">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};