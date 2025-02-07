// src/auth/context/jwt/keycloak.ts
import axios from 'axios';

export const loginToKeycloak = async (username: string, password: string) => {
  const clientId = 'yemsys-client';
  const clientSecret = 'ToFyURUm71hyBJtQQF5qBtcnEjh3tNYo'; // Reemplaza con tu client_secret
  const realm = 'master';
  const url = `http://localhost:8080/realms/${realm}/protocol/openid-connect/token`;

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
    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Error en la autenticación con Keycloak:', error);
    throw error;
  }
};
