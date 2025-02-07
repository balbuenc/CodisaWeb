export const getRolesFromToken = (): string[] => {
    try {
      const token = localStorage.getItem('accessToken'); // Obtener el token del localStorage
      if (!token) {
        console.warn('No se encontró el token en localStorage');
        return [];
      }
  
      const decoded: any = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
      return decoded.realm_access?.roles || [];
    } catch (error) {
      console.error('Error al obtener roles del token:', error);
      return [];
    }
  };
  