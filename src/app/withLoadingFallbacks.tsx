import type { RouteObject } from 'react-router';
import { LoadingScreen } from './pages/LoadingScreen';

/**
 * Gives every route that loads data a loading screen for the very first page load, which React
 * Router needs to render something while the data arrives.
 */
export function withLoadingFallbacks(routes: RouteObject[]): RouteObject[] {
  return routes.map((route) => {
    const withChildren = route.children
      ? { ...route, children: withLoadingFallbacks(route.children) }
      : route;
    if (!route.loader || route.hydrateFallbackElement) return withChildren;
    return { ...withChildren, hydrateFallbackElement: <LoadingScreen /> };
  });
}
