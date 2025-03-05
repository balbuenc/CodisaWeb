import axios from 'axios';
import { CONFIG } from 'src/config-global';

export const checkKeycloakSession = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.warn('No hay token de acceso disponible.');
    return true; // Usuario no autenticado
  }

  try {
    const response = await axios.post(
      `${CONFIG.serverUrl}:4000/api/keycloak/check-session`, // ✅ Usa CONFIG.serverUrl
      { token: accessToken }, // Enviar token en el body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Respuesta del backend:', response.data);

    return response.data.active === true; // Retornar si el token es activo
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return false; // Si hay error, consideramos que la sesión ha expirado
  }
};

export const logoutFromKeycloak = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    console.warn('No hay refresh token disponible, cerrando sesión localmente.');
    handleLocalLogout();
    return;
  }

  try {
    const response = await axios.post(
      `${CONFIG.serverUrl}:4000/api/keycloak/logout`,
      { refresh_token: refreshToken }, // Enviamos en el body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Sesión cerrada en Keycloak correctamente:', response.data);
  } catch (error) {
    console.error('❌ Error al cerrar sesión en Keycloak:', error.response?.data || error.message);
  } finally {
    handleLocalLogout();
  }
};
 
export const changePasswordFromKeycloak = async (nuevaContraseña: string) => {
  try {
    const token = localStorage.getItem('accessToken'); // Obtener el token
    if (!token) {
      console.warn('No se encontró el token en localStorage');
      return { success: false, message: 'No se encontró el token en localStorage' };
    }

    // Decodificar el token para obtener el userId
    const idUsuario = JSON.parse(atob(token.split('.')[1]))?.sub; // Extraer el "sub" que es el userId

    if (!idUsuario) {
      console.warn('No se pudo obtener el ID de usuario del token.');
      return { success: false, message: 'No se pudo obtener el ID de usuario.' };
    }

    // Llamar a la API para cambiar la contraseña
    const response = await axios.post(
      `${CONFIG.serverUrl}:4000/api/keycloak/change-password`,
      { userId: idUsuario, newPassword: nuevaContraseña }, // Enviamos en el body
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
      }
    );

    return response.data; // Retorna el mensaje de éxito
  } catch (error: any) {
    console.error('❌ Error al cambiar la contraseña:', error.response?.data || error.message);
    return { success: false, message: 'Error al cambiar la contraseña' };
  }
};


export const loginToKeycloak = async (username: string, password: string) => {
  try {
    const response: any = await axios.post(
      `${CONFIG.serverUrl}:4000/api/keycloak/login`,
      JSON.stringify({ username, password }), // Asegurar que se envía en formato JSON
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { access_token, refresh_token } = response.data.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);

    return access_token;
  } catch (error: any) {
    throw error.response.data.error;
  }
};

export const checkSessionWithRefreshToken = async () => {
  const url = 'http://192.168.0.198:8089/realms/master/protocol/openid-connect/token';
  const client_id = 'codisa-system';
  const client_secret = 'dIqawCwNKrvQNWw5638NkKThI0dVbCKc';
  const refresh_token = localStorage.getItem('refreshToken');

  if (!refresh_token) {
    console.warn('No hay refresh token disponible.');
    return true; // Usuario no autenticado
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    // Si la respuesta no es exitosa, el token no es válido
    if (!response.ok) {
      console.warn('El refresh token ya no es válido.');
      return false; // Sesión expirada
    }

    const data = await response.json();

    // Si el servidor responde con un error (ej. "invalid_grant"), también lo consideramos sesión expirada
    if (data.error) {
      console.warn('El refresh token ha expirado:', data.error_description || data.error);
      return false;
    }

    console.log('Nuevo token obtenido:', data);

    // Actualizar tokens en localStorage
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);

    return true; // Usuario sigue autenticado
  } catch (error) {
    console.error('Error al refrescar token:', error);
    return false; // Usuario no autenticado
  }
};

const handleLocalLogout = () => {
  // Elimina los tokens del localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  // Redirigir al login
  window.location.href = '/auth/jwt/sign-in';
};
