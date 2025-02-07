import { toast } from 'src/components/snackbar'; // Módulos internos (absolutos)
import { paths } from 'src/routes/paths';
import axios from 'src/utils/axios';

import { STORAGE_KEY ,LOCAL_STORAGE_KEY} from './constant'; // Módulo relativo

// ----------------------------------------------------------------------
// Decodificar el token
export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------
// Validar el token
export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------
// Manejar expiración del token
export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      // Remover el token del almacenamiento
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      // Mostrar mensaje con `toast`
      toast.error('¡El token ha expirado!');
      alert('Token expired!');

      // Redirigir al inicio de sesión
      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------
// Configurar sesión
export async function setSession(accessToken: string | null) {
  try {
    toast.error('¡El token ha expirado!');
    if (accessToken) {
      // Guardar el token en sessionStorage
      sessionStorage.setItem(STORAGE_KEY, accessToken);

      // Configurar el token en los headers de axios
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Decodificar el token
      const decodedToken = jwtDecode(accessToken);

      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp); // Configurar tiempo de expiración
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
      // Limpiar sesión
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}
