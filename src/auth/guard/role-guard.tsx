import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ForbiddenIllustration } from 'src/assets/illustrations';
import { varBounce, MotionContainer } from 'src/components/animate';
import { m } from 'framer-motion';
import { getRolesFromToken } from 'src/auth/guard/role-utils';

// ----------------------------------------------------------------------

type RoleGuardProps = {
  children: React.ReactNode;
  requiredRoles: string[]; // Roles necesarios para acceder a esta ruta
};

 
export function RoleGuard({ children, requiredRoles }: RoleGuardProps) {
  // Obtener roles del token
  const userRoles = getRolesFromToken();

  // Verificar si el usuario tiene alguno de los roles requeridos
  const hasAccess = requiredRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    // Mostrar la pantalla de "Permiso denegado"
    return (
      <Container component={MotionContainer} sx={{ textAlign: 'center', mt: 5 }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permiso denegado
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            No tienes acceso a esta página.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    );
  }

  // Si tiene acceso, renderizar los hijos
  return <>{children}</>;
}
