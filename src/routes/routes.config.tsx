import type { RouteObject } from 'react-router-dom';
import Advertisement from '../pages/Advertisement/Advertisement';
import SignIn from '../pages/Auth/SignIn/SignIn';
import SignUp from '../pages/Auth/SignUp/SignUp';
import CreateAdvertisement from '../pages/CreateAdvertisement/CreateAdvertisement';
import CreateProperty from '../pages/CreateProperty/CreateProperty';
import Home from '../pages/Home/Home';
import LandingPage from '../pages/LandingPage/LandingPage';
import Search from '../pages/Search/Search';

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
  },
  {
    path:"/anunciar",
    element:<CreateAdvertisement/>
  },
  {
    path:"/propriedades/cadastrar",
    element:<CreateProperty/>
  },
  {
    path:"/search",
    element:<Search/>
  },
  {
    path:"/anuncios/:id",
    element:<Advertisement/>
  }
];

export default routes;
