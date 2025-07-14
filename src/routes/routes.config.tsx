import type { RouteObject } from "react-router-dom";
import LandlordRoute from "../components/LandlordRoute";
import TenantRoute from "../components/TenantRoute";
import Advertisement from "../pages/Advertisement/Advertisement";
import SignIn from "../pages/Auth/SignIn/SignIn";
import SignUp from "../pages/Auth/SignUp/SignUp";
import CreateAdvertisement from "../pages/CreateAdvertisement/CreateAdvertisement";
import CreateProperty from "../pages/CreateProperty/CreateProperty";
import Home from "../pages/Home/Home";
import LandingPage from "../pages/LandingPage/LandingPage";
import Property from "../pages/Property/Property";
import Reports from "../pages/Reports/Reports";
import Search from "../pages/Search/Search";
import TenantReports from "../pages/TenantReports/TenantReports";
import TicketManagement from "../pages/TicketManagement/TicketManagement";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/landing-page",
    element: <LandingPage />,
  },
  {
    path: "/auth/sign-up",
    element: <SignUp />,
  },
  {
    path: "/auth/sign-in",
    element: <SignIn />,
  },
  {
    path: "/anunciar",
    element: (
      <LandlordRoute>
        <CreateAdvertisement />
      </LandlordRoute>
    ),
  },
  {
    path: "/proprietario/gerenciar",
    element: (
      <LandlordRoute>
        <Property />
      </LandlordRoute>
    ),
  },
  {
    path: "/proprietario/gerenciar/relatorios",
    element: (
      <LandlordRoute>
        <Reports />
      </LandlordRoute>
    ),
  },
  {
    path: "/propriedades/cadastrar",
    element: (
      <LandlordRoute>
        <CreateProperty />,
      </LandlordRoute>
    ),
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/anuncios/:id",
    element: (
      <TenantRoute>
        <Advertisement />,
      </TenantRoute>
    ),
  },
  {
    path: "/relatorios",
    element: (
      <TenantRoute>
        <TenantReports />
      </TenantRoute>
    ),
  },
  {
    path: "/inquilino/contratos",
    element: (
      <TenantRoute>
        <TenantReports />
      </TenantRoute>
    ),
  },
  {
    path: "/proprietario/imovel/:propertyId/tickets",
    element: (
      <LandlordRoute>
        <TicketManagement />
      </LandlordRoute>
    ),
  },
];

export default routes;
