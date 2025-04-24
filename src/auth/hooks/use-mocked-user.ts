import { jwtDecode } from 'jwt-decode'; // primero, externo
import { _mock } from 'src/_mock'; // segundo, absoluto
import { LOCAL_STORAGE_KEY } from '../context/jwt'; // tercero, relativo

// To get the user from the <AuthContext/>, you can use

// Change:
// import { useMockedUser } from 'src/auth/hooks';
// const { user } = useMockedUser();

// To:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

interface DecodedToken {
  name?: string;
  email?: string;
  preferred_username?: string;
}
export function useMockedUser() {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY);
  let displayName = '';
  let email = '';

  if (accessToken) {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    displayName = decoded.name || decoded.preferred_username || '';
    email = decoded.email || '';
  }

  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName,
    email,
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    country: _mock.countryNames(1),
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: false,
  };

  return { user };
}
