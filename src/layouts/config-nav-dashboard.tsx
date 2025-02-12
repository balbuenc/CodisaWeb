import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';
import { jwtDecode } from 'jwt-decode';  
import { ROLES_HIERARCHY, RoleKey } from 'src/auth/guard/roles-hierarchy';
import { ROLES } from '@guard/roles.constants';

 
const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  chicken: icon('ic-chicken'), // Nuevo ícono de gallina
  proyeccion: icon('ic-proyeccion'), // Nuevo ícono de gallina
  embarque: icon('ic-embarque'),
};

export const navData = [
  {
    subheader: 'Linker Codisa',
    items: [
      {
        title: 'Modulo Auditoria',
        path: paths.dashboard.auditoria.root,
        icon: ICONS.label,
        roles: [ROLES.MODULO_AUDITORIA],
        children: [
          {
            title: 'Modulo inventario',
            path: paths.dashboard.auditoria.moduloInventario.root,
            icon: ICONS.folder,
            roles: [ROLES.MODULO_INVENTARIO],
            children: [
              {
                title: 'Crear toma de inventario',
                path: paths.dashboard.auditoria.moduloInventario.crearToma,
                roles: [
                  ROLES.GENERACION_TOMA_INVENTARIO_VIEW,
                  ROLES.GENERACION_TOMA_INVENTARIO_CREATE,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const filterNavDataByRoles = (roles: string[], initialNavData: any[]): any[] => {
  // Obtener los roles expandidos (ajustado para no incluir secundarios específicos si se desea)
  const getExpandedRoles = (userRoles: string[]): string[] => {
    const expandedRoles = new Set<string>(userRoles);

    return Array.from(expandedRoles);
  };

  const expandedRoles = getExpandedRoles(roles);
  const filterItems = (items: any[]): any[] =>
    items
      .map((item) => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined,
      }))
      .filter((item) =>
        item.roles
          ? item.roles.some((role: string) => expandedRoles.includes(role))
          : item.children && item.children.length > 0
      );

  const newNav = initialNavData.map((section) => ({
    ...section,
    items: filterItems(section.items),
  }));

  console.log('Filtered Nav Data:', newNav);
  return newNav;
};

