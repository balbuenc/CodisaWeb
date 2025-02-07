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
    subheader: 'Maehara',
    items: [
      {
        title: 'Clasificadora CYO',
        path: paths.dashboard.cyo.root,
        icon: ICONS.chicken,
        roles: [ROLES.CYO_READ],
        children: [
          {
            title: 'PTC',
            path: paths.dashboard.cyo.ptc.root,
            //   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',

            icon: ICONS.chicken,
            roles: [ROLES.CYO_PTC_READ],
            children: [
              {
                title: 'Liberados recogidas',
                path: paths.dashboard.cyo.ptc.registroLiberado,
                // path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',

                roles: [ROLES.CYO_PTC_RECOGIDA_LIBERADOS_READ],
              },
              {
                title: 'Retenido recogidas',
                path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a',
                roles: [ROLES.AVIARIOS_READ],
              },
            ],
          },
        ],
      },
      {
        title: 'Informes',
        path: paths.dashboard.informes.root,
        icon: ICONS.blog,
        roles: [ROLES.INFORMES_READ],
        children: [
          {
            title: 'Producción primaria',
            path: paths.dashboard.informes.produccionPrimaria.root,
            roles: [ROLES.INFORMES_PPR_READ],
            children: [
              {
                title: 'Informe de ventas',
                path: paths.dashboard.informes.produccionPrimaria.informeVentas,
                roles: [ROLES.INFORMES_VENTA_READ],
              },
              {
                title: 'Informe de aviarios',
                path: paths.dashboard.informes.produccionPrimaria.informeVentas2,
                roles: [ROLES.INFORMES_VENTA_READ],
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

