import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { VisualizerPage } from '@/pages/VisualizerPage';
import { ProfileManagerPage } from '@/pages/ProfileManagerPage';
import { DocsPage } from '@/pages/DocsPage';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/visualizer",
    element: <VisualizerPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profiles",
    element: <ProfileManagerPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs",
    element: <DocsPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
export function App() {
  return <RouterProvider router={router} />;
}