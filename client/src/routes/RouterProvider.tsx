// src/routes/RouterProvider.tsx
import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import type { Router } from '@tanstack/react-router';
import { router } from './router';

type Props = {
  router: typeof router; // ✅ Derive the exact type from the router instance
};

const RouterProvider = ({ router }: Props) => {
  return <TanStackRouterProvider router={router} />;
};

export default RouterProvider;
