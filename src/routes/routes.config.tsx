import type { RouteObject } from 'react-router-dom';
import SignIn from '../pages/Auth/SignIn/SignIn';
import SignUp from '../pages/Auth/SignUp/SignUp';
import Home from '../pages/Home/Home';
import LandingPage from '../pages/LandingPage/LandingPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/landing-page',
    element: <LandingPage />,
  },
  {
    path:"/auth/sign-up",
    element:<SignUp/>
  },
  {
    path:"/auth/sign-in",
    element:<SignIn/>
  }
];

export default routes;
