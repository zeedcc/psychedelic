import { RouteObject } from 'react-router-dom';
import HomePage from './pages/index';
import CatalogPage from './pages/catalog';
import CartPage from './pages/cart';
import AdminPage from './pages/admin/index';
import AdminLoginPage from './pages/admin/login';
import ProdNotFoundPage from './pages/_404';

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/catalog', element: <CatalogPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '*', element: <ProdNotFoundPage /> },
];

export type Path = '/' | '/catalog' | '/cart' | '/admin' | '/admin/login';
export type Params = Record<string, string | undefined>;
