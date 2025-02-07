import { ROLES } from '@guard/roles.constants';

export const ROLES_HIERARCHY = {
    // Módulo: Producción primaria
    [ROLES.PRODUCCION_READ]:[ROLES.PROYECCION_READ, ROLES.UNIDADES_READ], // Solo incluye submódulos y accesos directos directamente accesibles desde Producción primaria
  
    // Submódulo: Proyección dentro de Producción primaria
    proyeccion_read: [ROLES.RAZAS_READ,ROLES.AVIARIOS_READ], // Razas y Aviarios están dentro del submódulo Proyección
  
    // Módulo: Informes
    informes_read: [ROLES.INFORMES_PPR_READ], // Informes incluye Producción primaria como submódulo
  
    // Submódulo: Producción prim aria dentro de Informes
    informes_ppr_read: [ROLES.INFORMES_VENTA_READ,ROLES.INFORMES_AVIARIOS_READ], // Ventas y Aviarios son accesos directos de Producción primaria dentro de Informes
  };

  export type RoleKey = keyof typeof ROLES_HIERARCHY;

  /**
    Explicación
        1-produccion_read
            Solo incluye accesos o submódulos directamente visibles desde Producción primaria en el menú lateral.
            Aquí, incluye:
                proyeccion_read: Submódulo.
                unidades_read: Acceso directo al menú Unidades.
        No incluye razas_read ni aviarios_read directamente porque estos pertenecen a proyeccion_read.

        2-proyeccion_read
            Incluye los accesos directos que pertenecen a este submódulo:
                razas_read: Acceso directo.
                aviarios_read: Acceso directo.
        
        3-informes_read
            Solo incluye su submódulo informes_ppr_read (Producción primaria dentro de Informes).
       
        4-informes_ppr_read
            Incluye los accesos directos que pertenecen a este submódulo:
                informes_venta_read: Acceso directo.
                informes_aviarios_read: Acceso directo.
   */