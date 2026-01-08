import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { VisualizerPage } from '@/pages/VisualizerPage';
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
]);
export function App() {
  return <RouterProvider router={router} />;
}