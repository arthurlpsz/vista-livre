import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoginPage } from '../pages/admin/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ImoveisListPage } from '../pages/admin/ImoveisListPage';
import { ImovelFormPage } from '../pages/admin/ImovelFormPage';
import { UsuariosListPage } from '../pages/admin/UsuariosListPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirecionamento provisório até a construção do Site Público na Etapa 5 */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Autenticação Administrativa */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Rotas Protegidas do Painel Administrativo */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="imoveis" element={<ImoveisListPage />} />
            <Route path="imoveis/novo" element={<ImovelFormPage />} />
            <Route path="imoveis/:id/editar" element={<ImovelFormPage />} />

            <Route element={<PrivateRoute rolesPermitidos={['ADMIN']} />}>
              <Route path="usuarios" element={<UsuariosListPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}