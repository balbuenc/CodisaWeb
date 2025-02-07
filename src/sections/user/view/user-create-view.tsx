import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RegistroPtc } from '../user-new-edit-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Registro de PTC"
        links={[
          { name: 'Dashboard', href: paths.dashboard.cyo.root },
          { name: 'Nuevo registro', href: paths.dashboard.user.root },
          { name: 'Registro liberado' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RegistroPtc />
    </DashboardContent>
  );
}
