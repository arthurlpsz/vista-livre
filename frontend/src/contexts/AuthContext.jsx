import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('@VistaLivre:usuario');
    return salvo ? JSON.parse(salvo) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validarSessao() {
      const token = localStorage.getItem('@VistaLivre:token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUsuario(data.usuario);
        localStorage.setItem('@VistaLivre:usuario', JSON.stringify(data.usuario));
      } catch {
        localStorage.removeItem('@VistaLivre:token');
        localStorage.removeItem('@VistaLivre:usuario');
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }

    validarSessao();
  }, []);

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    localStorage.setItem('@VistaLivre:token', data.token);
    localStorage.setItem('@VistaLivre:usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('@VistaLivre:token');
    localStorage.removeItem('@VistaLivre:usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: Boolean(usuario),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}