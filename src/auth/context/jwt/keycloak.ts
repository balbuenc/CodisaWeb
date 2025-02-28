// src/auth/context/jwt/keycloak.ts
import axios from 'axios';
 
export const loginToKeycloak = async (username: string, password: string) => {
  const clientId = 'codisa-system';
  const clientSecret = 'dIqawCwNKrvQNWw5638NkKThI0dVbCKc'; // Reemplaza con tu client_secret
  const realm = 'master';
  const url =  `http://192.168.0.198:8089/realms/${realm}/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    const refresh_token = response.data.refresh_token;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refresh_token);

    return accessToken;
  } catch (error) {
    console.error('Error en la autenticación con Keycloak:', error);
    throw error;
  }
};

 
export const logoutFromKeycloak = async () => {
  const realm = 'master';
  const clientId = 'codisa-system';
  const clientSecret = 'dIqawCwNKrvQNWw5638NkKThI0dVbCKc';
  const url =  `http://192.168.0.198:8089/realms/${realm}/protocol/openid-connect/logout`;

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    console.warn('No hay refresh token disponible, cerrando sesión localmente.');
    handleLocalLogout();
    return;
  }

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('refresh_token', refreshToken);

  try {
    await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('Sesión cerrada en Keycloak correctamente.');
  } catch (error) {
    console.error('Error al cerrar sesión en Keycloak:', error);
  } finally {
    handleLocalLogout();
  }
};

export const checkSessionWithRefreshToken = async () => {
  const url = "http://192.168.0.198:8089/realms/master/protocol/openid-connect/token";
  const client_id = "codisa-system";
  const client_secret = "dIqawCwNKrvQNWw5638NkKThI0dVbCKc";
  const refresh_token = localStorage.getItem("refreshToken");

  if (!refresh_token) {
    console.warn("No hay refresh token disponible.");
    return true; // Usuario no autenticado
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        grant_type: "refresh_token",
        refresh_token
      }),
    });

    // Si la respuesta no es exitosa, el token no es válido
    if (!response.ok) {
      console.warn("El refresh token ya no es válido.");
      return false; // Sesión expirada
    }

    const data = await response.json();

    // Si el servidor responde con un error (ej. "invalid_grant"), también lo consideramos sesión expirada
    if (data.error) {
      console.warn("El refresh token ha expirado:", data.error_description || data.error);
      return false;
    }

    console.log("Nuevo token obtenido:", data);

    // Actualizar tokens en localStorage
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    return true; // Usuario sigue autenticado
  } catch (error) {
    console.error("Error al refrescar token:", error);
    return false; // Usuario no autenticado
  }
};


export const checkKeycloakSession = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.warn('No hay token de acceso disponible.');
    return true; // Usuario no autenticado
  }

  try {
    const response = await axios.post(
      'http://localhost:4000/api/keycloak/check-session',
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


const handleLocalLogout = () => {
  // Elimina los tokens del localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  // Redirigir al login
  window.location.href = '/auth/jwt/sign-in';
};
