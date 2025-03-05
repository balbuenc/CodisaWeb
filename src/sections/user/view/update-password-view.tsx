import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AccountChangePassword } from 'src/sections/account/account-change-password';

// ----------------------------------------------------------------------

export function UpdatePasswordView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cambio de Contraseña"
        links={[
          { name: 'Seguridad', href: paths.dashboard.root } 
        ]}
         
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AccountChangePassword />
    </DashboardContent>
  );
}
