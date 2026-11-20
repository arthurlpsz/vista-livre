import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Páginas Públicas
import { HomePage } from '../pages/public/HomePage';
import { CatalogoPage } from '../pages/public/CatalogoPage';
import { ImovelDetalhesPage } from '../pages/public/ImovelDetalhesPage';
import { SobrePage } from '../pages/public/SobrePage';
import { ContatoPage } from '../pages/public/ContatoPage';

// Páginas Administrativas
import { LoginPage } from '../pages/admin/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ImoveisListPage } from '../pages/admin/ImoveisListPage';
import { ImovelFormPage } from '../pages/admin/ImovelFormPage';
import { UsuariosListPage } from '../pages/admin/UsuariosListPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site Público */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/imoveis" element={<CatalogoPage />} />
          <Route path="/imoveis/:codigo" element={<ImovelDetalhesPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contato" element={<ContatoPage />} />
        </Route>

        {/* Login Administrativo */}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}