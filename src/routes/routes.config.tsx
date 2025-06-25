import type { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import LandingPage from '../pages/LandingPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/landing-page',
    element: <LandingPage />,
  },
];

export default routes;
