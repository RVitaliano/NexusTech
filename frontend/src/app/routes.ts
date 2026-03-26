import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Produtos } from './pages/Produtos';
import { Servicos } from './pages/Servicos';
import { Estoque } from './pages/Estoque';
import { Relatorios } from './pages/Relatorios';
import { MainLayout } from './layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'produtos',
        Component: Produtos,
      },
      {
        path: 'servicos',
        Component: Servicos,
      },
      {
        path: 'estoque',
        Component: Estoque,
      },
      {
        path: 'relatorios',
        Component: Relatorios,
      },
    ],
  },
]);
