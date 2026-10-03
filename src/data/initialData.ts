import { KPI, ActionPlan, KpiTask, AreaManagementTask } from '../types';

// MÓDULO 1: Seguimiento Trimestral de KPIs Institucionales
export const INITIAL_KPIS: KPI[] = [
  {
    id: 'kpi-1',
    code: 'KPI-CAL-01',
    name: 'Índice de Satisfacción de Clientes y Comerciantes (121 Clientes)',
    objective: 'Medir trimestralmente el nivel de percepción de calidad en servicios, salubridad y logística de los 121 comerciantes y clientes mayoristas de Granabastos',
    area: 'Gestión Humana & Calidad',
    targetValue: 88,
    currentValue: 84.5,
    unit: '%',
    direction: 'higher_is_better',
    compliancePercentage: 96.02,
    responsible: 'Lic. Martha Restrepo (Coord. Calidad)',
    responsibleEmail: 'calidad@granabastos.com.co',
    periodicity: 'Trimestral',
    lastUpdated: '2026-06-30',
    status: 'En meta',
    observations: 'Medición de corte T2 aplicada sobre 118 de los 121 clientes activos (cobertura del 97.5%). Excelente valoración en seguridad; se identificaron oportunidades de mejora en la infraestructura locativa de los pabellones.',
    targetDriveFolder: 'https://drive.google.com/drive/folders/Granabastos-Evidencias-SGC-2028/Satisfaccion-Clientes',
    strategicPlanning2028: {
      baseline2023: 75.0,
      target2024: 80.0,
      target2025: 84.0,
      target2026: 88.0,
      target2027: 92.0,
      target2028: 95.0,
      strategyNotes: 'Plan Estratégico 2028: Elevar la satisfacción integral del cliente mayorista mediante modernización física de locales, básculas inteligentes y pasarela de pagos digital.'
    },
    history: [
      {
        id: 'h1-1',
        quarter: 'T1',
        year: 2026,
        date: '2026-03-31',
        targetQuarter: 86.0,
        value: 82.0,
        compliancePercentage: 95.35,
        note: 'Encuesta primer trimestre aplicada a 115 clientes. Evidencias de tabulación y formatos firmados archivados.',
        registeredBy: 'Martha Restrepo',
        driveFolderDestination: 'Granabastos/Calidad/2026/T1-Satisfaccion',
        attachedFiles: [
          {
            id: 'att-1-1',
            name: 'Tabulacion_Satisfaccion_121_Clientes_T1_2026.xlsx',
            size: 145000,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadDate: '2026-03-31',
            driveFolderTarget: 'Granabastos/Calidad/2026/T1-Satisfaccion',
            externalUrl: 'https://drive.google.com/file/d/ejemplo-tabulacion-t1/view'
          },
          {
            id: 'att-1-2',
            name: 'Informe_Gerencial_Calidad_Servicio_T1.pdf',
            size: 890000,
            type: 'application/pdf',
            uploadDate: '2026-03-31',
            driveFolderTarget: 'Granabastos/Calidad/2026/T1-Satisfaccion',
            externalUrl: 'https://drive.google.com/file/d/ejemplo-informe-t1/view'
          }
        ]
      },
      {
        id: 'h1-2',
        quarter: 'T2',
        year: 2026,
        date: '2026-06-30',
        targetQuarter: 88.0,
        value: 84.5,
        compliancePercentage: 96.02,
        note: 'Encuesta segundo trimestre aplicada a 118 clientes comerciales. Mejora del 2.5% respecto a T1.',
        registeredBy: 'Martha Restrepo',
        driveFolderDestination: 'Granabastos/Calidad/2026/T2-Satisfaccion',
        attachedFiles: [
          {
            id: 'att-1-3',
            name: 'Reporte_Grafico_Encuesta_T2_2026.pdf',
            size: 1240000,
            type: 'application/pdf',
            uploadDate: '2026-06-30',
            driveFolderTarget: 'Granabastos/Calidad/2026/T2-Satisfaccion',
            externalUrl: 'https://drive.google.com/file/d/ejemplo-reporte-t2/view'
          }
        ]
      }
    ]
  },
  {
    id: 'kpi-2',
    code: 'KPI-FIN-02',
    name: 'Índice de Cartera Vencida (> 60 días)',
    objective: 'Reducir sostenidamente el saldo moratorio de arrendamientos y cuotas de mantenimiento hacia 2028',
    area: 'Financiera & Administrativa',
    targetValue: 4.5,
    currentValue: 6.8,
    unit: '%',
    direction: 'lower_is_better',
    compliancePercentage: 66.18,
    responsible: 'Dra. Claudia Ortiz (Dir. Financiera)',
    responsibleEmail: 'financiera@granabastos.com.co',
    periodicity: 'Trimestral',
    lastUpdated: '2026-06-30',
    status: 'Crítico',
    observations: 'Concentración de mora en 14 clientes comerciales de los pabellones de cárnicos y abarrotes. Se ejecutan acuerdos de pago supervisados.',
    targetDriveFolder: 'https://drive.google.com/drive/folders/Granabastos-Evidencias-SGC-2028/Financiera-Cartera',
    strategicPlanning2028: {
      baseline2023: 8.5,
      target2024: 6.0,
      target2025: 5.0,
      target2026: 4.5,
      target2027: 3.5,
      target2028: 2.8,
      strategyNotes: 'Meta Visión 2028: Situar la cartera morosa por debajo del 3.0% consolidando cobro coactivo y recaudo omnicanal.'
    },
    history: [
      {
        id: 'h2-1',
        quarter: 'T1',
        year: 2026,
        date: '2026-03-31',
        targetQuarter: 5.0,
        value: 7.2,
        compliancePercentage: 69.44,
        note: 'Cierre financiero primer trimestre. Se radicaron 12 cobros jurídicos.',
        registeredBy: 'Claudia Ortiz',
        driveFolderDestination: 'Granabastos/Financiera/2026/T1-Cartera',
        attachedFiles: [
          {
            id: 'att-2-1',
            name: 'Balance_Cartera_Edad_Saldos_Marzo_2026.xlsx',
            size: 320000,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadDate: '2026-03-31',
            driveFolderTarget: 'Granabastos/Financiera/2026/T1-Cartera',
            externalUrl: 'https://drive.google.com/file/d/cartera-t1/view'
          }
        ]
      },
      {
        id: 'h2-2',
        quarter: 'T2',
        year: 2026,
        date: '2026-06-30',
        targetQuarter: 4.8,
        value: 6.8,
        compliancePercentage: 70.58,
        note: 'Cierre financiero segundo trimestre. Recuperación de $142 millones en acuerdos de pago.',
        registeredBy: 'Claudia Ortiz',
        driveFolderDestination: 'Granabastos/Financiera/2026/T2-Cartera',
        attachedFiles: [
          {
            id: 'att-2-2',
            name: 'Acta_Comite_Cartera_Junio_2026.pdf',
            size: 610000,
            type: 'application/pdf',
            uploadDate: '2026-06-30',
            driveFolderTarget: 'Granabastos/Financiera/2026/T2-Cartera',
            externalUrl: 'https://drive.google.com/file/d/acta-cartera-t2/view'
          }
        ]
      }
    ]
  },
  {
    id: 'kpi-3',
    code: 'KPI-COM-03',
    name: 'Tasa de Ocupación de Bodegas y Locales',
    objective: 'Garantizar el pleno arrendamiento de los 480 locales y bodegas del complejo comercial',
    area: 'Comercial & Mercadeo',
    targetValue: 95.0,
    currentValue: 93.2,
    unit: '%',
    direction: 'higher_is_better',
    compliancePercentage: 98.11,
    responsible: 'Ing. Carlos Mendoza (Dir. Comercial)',
    responsibleEmail: 'comercial@granabastos.com.co',
    periodicity: 'Trimestral',
    lastUpdated: '2026-06-30',
    status: 'En meta',
    observations: 'Demanda creciente en bodegas de atmósfera controlada. 8 nuevos contratos formalizados en Bloque B.',
    targetDriveFolder: 'https://drive.google.com/drive/folders/Granabastos-Evidencias-SGC-2028/Comercial-Ocupacion',
    strategicPlanning2028: {
      baseline2023: 88.0,
      target2024: 92.0,
      target2025: 94.0,
      target2026: 95.0,
      target2027: 97.0,
      target2028: 98.5,
      strategyNotes: 'Meta Visión 2028: Infraestructura 100% arrendada y expansión modular de bodegas refrigeradas Fase II.'
    },
    history: [
      {
        id: 'h3-1',
        quarter: 'T1',
        year: 2026,
        date: '2026-03-31',
        targetQuarter: 94.0,
        value: 91.5,
        compliancePercentage: 97.34,
        note: 'Corte T1: 439 locales ocupados de 480 disponibles.',
        registeredBy: 'Carlos Mendoza',
        driveFolderDestination: 'Granabastos/Comercial/2026/T1-Ocupacion',
        attachedFiles: [
          {
            id: 'att-3-1',
            name: 'Inventario_Espacios_Comerciales_T1.xlsx',
            size: 210000,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadDate: '2026-03-31',
            driveFolderTarget: 'Granabastos/Comercial/2026/T1-Ocupacion'
          }
        ]
      },
      {
        id: 'h3-2',
        quarter: 'T2',
        year: 2026,
        date: '2026-06-30',
        targetQuarter: 95.0,
        value: 93.2,
        compliancePercentage: 98.11,
        note: 'Corte T2: 447 locales ocupados de 480 disponibles.',
        registeredBy: 'Carlos Mendoza',
        driveFolderDestination: 'Granabastos/Comercial/2026/T2-Ocupacion',
        attachedFiles: [
          {
            id: 'att-3-2',
            name: 'Informe_Comercial_Censo_Ocupacion_T2.pdf',
            size: 780000,
            type: 'application/pdf',
            uploadDate: '2026-06-30',
            driveFolderTarget: 'Granabastos/Comercial/2026/T2-Ocupacion'
          }
        ]
      }
    ]
  },
  {
    id: 'kpi-4',
    code: 'KPI-OPE-04',
    name: 'Volumen Trimestral de Alimentos Movilizados',
    objective: 'Asegurar el flujo continuo de abastecimiento de productos perecederos en el Caribe colombiano',
    area: 'Operaciones & Logística',
    targetValue: 105000,
    currentValue: 102400,
    unit: 'Toneladas',
    direction: 'higher_is_better',
    compliancePercentage: 97.52,
    responsible: 'Dr. Hernando Valdés (Gerente Operaciones)',
    responsibleEmail: 'operaciones@granabastos.com.co',
    periodicity: 'Trimestral',
    lastUpdated: '2026-06-30',
    status: 'En meta',
    observations: 'Movilización fluida con incremento en granos y hortalizas. Básculas operando con calibración certificada.',
    targetDriveFolder: 'https://drive.google.com/drive/folders/Granabastos-Evidencias-SGC-2028/Operaciones-Tonelaje',
    strategicPlanning2028: {
      baseline2023: 92000,
      target2024: 98000,
      target2025: 101000,
      target2026: 105000,
      target2027: 112000,
      target2028: 120000,
      strategyNotes: 'Plan 2028: Consolidar a Granabastos como nodo agroalimentario del Caribe con capacidad de 120.000 ton/trimestre.'
    },
    history: [
      {
        id: 'h4-1',
        quarter: 'T1',
        year: 2026,
        date: '2026-03-31',
        targetQuarter: 103000,
        value: 99800,
        compliancePercentage: 96.89,
        note: 'Consolidado primer trimestre de tiquetes de báscula de entrada.',
        registeredBy: 'Hernando Valdés',
        driveFolderDestination: 'Granabastos/Operaciones/2026/T1-Tonelaje',
        attachedFiles: [
          {
            id: 'att-4-1',
            name: 'Reporte_Bascula_Tonelaje_T1_2026.xlsx',
            size: 450000,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadDate: '2026-03-31',
            driveFolderTarget: 'Granabastos/Operaciones/2026/T1-Tonelaje'
          }
        ]
      },
      {
        id: 'h4-2',
        quarter: 'T2',
        year: 2026,
        date: '2026-06-30',
        targetQuarter: 105000,
        value: 102400,
        compliancePercentage: 97.52,
        note: 'Consolidado segundo trimestre. Alza en ingreso de carga pesada de Antioquia y Santanderes.',
        registeredBy: 'Hernando Valdés',
        driveFolderDestination: 'Granabastos/Operaciones/2026/T2-Tonelaje',
        attachedFiles: [
          {
            id: 'att-4-2',
            name: 'Certificados_Pesaje_Consolidado_T2.pdf',
            size: 1100000,
            type: 'application/pdf',
            uploadDate: '2026-06-30',
            driveFolderTarget: 'Granabastos/Operaciones/2026/T2-Tonelaje'
          }
        ]
      }
    ]
  },
  {
    id: 'kpi-5',
    code: 'KPI-AMB-05',
    name: 'Tasa de Aprovechamiento de Residuos Orgánicos',
    objective: 'Alcanzar una central de abastos con economía circular y residuo cero para 2028',
    area: 'Sostenibilidad & Ambiental',
    targetValue: 65.0,
    currentValue: 56.4,
    unit: '%',
    direction: 'higher_is_better',
    compliancePercentage: 86.77,
    responsible: 'Ing. Mateo Gómez (Líder Ambiental)',
    responsibleEmail: 'ambiental@granabastos.com.co',
    periodicity: 'Trimestral',
    lastUpdated: '2026-06-30',
    status: 'En riesgo',
    observations: 'Se fortalecen convenios con plantas de compostaje. Se requiere mejorar la separación en la fuente en pabellones B y D.',
    targetDriveFolder: 'https://drive.google.com/drive/folders/Granabastos-Evidencias-SGC-2028/Ambiental-Residuos',
    strategicPlanning2028: {
      baseline2023: 42.0,
      target2024: 52.0,
      target2025: 58.0,
      target2026: 65.0,
      target2027: 74.0,
      target2028: 82.0,
      strategyNotes: 'Visión 2028: Convertir a Granabastos en la central de abastos más sostenible de Colombia con 82% de reciclaje y biotransformación.'
    },
    history: [
      {
        id: 'h5-1',
        quarter: 'T1',
        year: 2026,
        date: '2026-03-31',
        targetQuarter: 62.0,
        value: 53.0,
        compliancePercentage: 85.48,
        note: 'Pesaje planta de acopio y entregas certificadas al banco de alimentos.',
        registeredBy: 'Mateo Gómez',
        driveFolderDestination: 'Granabastos/Ambiental/2026/T1-Residuos',
        attachedFiles: [
          {
            id: 'att-5-1',
            name: 'Planillas_Entrega_Compostera_T1.pdf',
            size: 520000,
            type: 'application/pdf',
            uploadDate: '2026-03-31',
            driveFolderTarget: 'Granabastos/Ambiental/2026/T1-Residuos'
          }
        ]
      },
      {
        id: 'h5-2',
        quarter: 'T2',
        year: 2026,
        date: '2026-06-30',
        targetQuarter: 65.0,
        value: 56.4,
        compliancePercentage: 86.77,
        note: 'Pesaje corte segundo trimestre. Se incorporaron 15 nuevos locales a la ruta verde.',
        registeredBy: 'Mateo Gómez',
        driveFolderDestination: 'Granabastos/Ambiental/2026/T2-Residuos',
        attachedFiles: [
          {
            id: 'att-5-2',
            name: 'Informe_Sostenibilidad_Residuos_T2_2026.pdf',
            size: 940000,
            type: 'application/pdf',
            uploadDate: '2026-06-30',
            driveFolderTarget: 'Granabastos/Ambiental/2026/T2-Residuos'
          }
        ]
      }
    ]
  }
];

// MÓDULO 2: Tareas Operativas de Recolección y Medición de cada KPI (Metodología para medir)
export const INITIAL_KPI_TASKS: KpiTask[] = [
  // Tareas para medir el KPI de Satisfacción (121 Clientes)
  {
    id: 'kt-1',
    kpiId: 'kpi-1',
    kpiCode: 'KPI-CAL-01',
    kpiName: 'Índice de Satisfacción de Clientes y Comerciantes (121 Clientes)',
    stepNumber: 1,
    title: 'Estructurar y Validar el Formato de la Encuesta Trimestral',
    description: 'Revisar y aprobar con Gerencia las preguntas de percepción sobre seguridad, aseo, iluminación, básculas y atención administrativa.',
    scheduledFrequency: 'Cada trimestre (Inicio de corte)',
    scheduledMonth: 'Mes 1 de cada trimestre',
    dueDate: '2026-07-10',
    completedDate: '2026-07-08',
    responsible: 'Lic. Martha Restrepo (Calidad)',
    status: 'Completada',
    observations: 'Formato estandarizado de 10 preguntas con escala Likert y espacio para observaciones puntuales.',
  },
  {
    id: 'kt-2',
    kpiId: 'kpi-1',
    kpiCode: 'KPI-CAL-01',
    kpiName: 'Índice de Satisfacción de Clientes y Comerciantes (121 Clientes)',
    stepNumber: 2,
    title: 'Programar Cronograma y Segmentación de los 121 Clientes',
    description: 'Organizar la ruta de visitas por pabellones (Pabellón de Abarrotes, Cárnicos, Frutas y Hortalizas, Bodegas Frías) para asegurar cobertura de los 121 clientes comerciales.',
    scheduledFrequency: 'Cada trimestre',
    scheduledMonth: 'Mes 2 de cada trimestre',
    dueDate: '2026-08-15',
    completedDate: '2026-08-14',
    responsible: 'Coord. Calidad & Auxiliar Operativo',
    status: 'Completada',
    observations: 'Ruta dividida en 3 semanas para no congestionar la operativa de los comerciantes en sus horas pico de descarga.',
  },
  {
    id: 'kt-3',
    kpiId: 'kpi-1',
    kpiCode: 'KPI-CAL-01',
    kpiName: 'Índice de Satisfacción de Clientes y Comerciantes (121 Clientes)',
    stepNumber: 3,
    title: 'Aplicación de Encuestas Presenciales a los 121 Clientes (Corte T3)',
    description: 'Aplicar el cuestionario digital/físico directamente con los propietarios o administradores autorizados de los 121 locales comerciales.',
    scheduledFrequency: 'Cada trimestre',
    scheduledMonth: 'Mes 3 de cada trimestre',
    dueDate: '2026-09-25',
    responsible: 'Equipo de Calidad y Atención al Comerciante',
    status: 'En curso',
    observations: 'Se han encuestado 92 clientes a la fecha. Restan 29 comerciantes del bloque de mayoristas frigoríficos.',
  },
  {
    id: 'kt-4',
    kpiId: 'kpi-1',
    kpiCode: 'KPI-CAL-01',
    kpiName: 'Índice de Satisfacción de Clientes y Comerciantes (121 Clientes)',
    stepNumber: 4,
    title: 'Tabulación Estadística, Cálculo del Indicador y Carga de Archivos de Soporte',
    description: 'Procesar los resultados en la matriz analítica, calcular el porcentaje de satisfacción alcanzado y adjuntar el archivo Excel y el informe PDF a la carpeta de Google Drive.',
    scheduledFrequency: 'Cada trimestre',
    scheduledMonth: 'Fin de cada trimestre',
    dueDate: '2026-10-05',
    responsible: 'Lic. Martha Restrepo (Calidad)',
    status: 'Pendiente',
    observations: 'Fecha límite fijada para consolidar el reporte oficial antes del Comité Gerencial de octubre.',
  },

  // Tareas para medir el KPI de Cartera Vencida
  {
    id: 'kt-5',
    kpiId: 'kpi-2',
    kpiCode: 'KPI-FIN-02',
    kpiName: 'Índice de Cartera Vencida (> 60 días)',
    stepNumber: 1,
    title: 'Conciliación Mensual de Saldos con Contabilidad y Tesorería',
    description: 'Cruce detallado de pagos bancarios, consignaciones y extractos contra la facturación mensual de cuotas y servicios comunes.',
    scheduledFrequency: 'Mensual (Día 5 de cada mes)',
    scheduledMonth: 'Mensual',
    dueDate: '2026-09-05',
    completedDate: '2026-09-05',
    responsible: 'Contador General & Tesorería',
    status: 'Completada',
    observations: 'Conciliación bancaria cerrada sin partidas pendientes.',
  },
  {
    id: 'kt-6',
    kpiId: 'kpi-2',
    kpiCode: 'KPI-FIN-02',
    kpiName: 'Índice de Cartera Vencida (> 60 días)',
    stepNumber: 2,
    title: 'Generación del Libro de Edades de Cartera y Cálculo de % Mayor a 60 Días',
    description: 'Emitir reporte del ERP contable con clasificación por tramos (0-30, 31-60, 61-90, >90 días) y subir la evidencia contable a la carpeta de cartera.',
    scheduledFrequency: 'Trimestral / Mensual',
    scheduledMonth: 'Fin de cada mes',
    dueDate: '2026-09-30',
    responsible: 'Dra. Claudia Ortiz (Financiera)',
    status: 'En curso',
    observations: 'Cálculo preliminar proyectado para el cierre del tercer trimestre.',
  },

  // Tareas para medir el KPI de Ocupación
  {
    id: 'kt-7',
    kpiId: 'kpi-3',
    kpiCode: 'KPI-COM-03',
    kpiName: 'Tasa de Ocupación de Bodegas y Locales',
    stepNumber: 1,
    title: 'Censo Físico Trimestral de Locales y Verificación de Contratos Vigentes',
    description: 'Inspección de campo en los 480 locales para verificar ocupación efectiva, subarriendos no autorizados y estado de llaves de bodegas libres.',
    scheduledFrequency: 'Trimestral',
    scheduledMonth: 'Septiembre',
    dueDate: '2026-09-20',
    completedDate: '2026-09-19',
    responsible: 'Auxiliar Comercial & Jurídica',
    status: 'Completada',
    observations: 'Censo 100% verificado: 449 locales activos, 31 disponibles para comercialización inmediata.',
  },

  // Tareas para medir el KPI de Tonelaje
  {
    id: 'kt-8',
    kpiId: 'kpi-4',
    kpiCode: 'KPI-OPE-04',
    kpiName: 'Volumen Trimestral de Alimentos Movilizados',
    stepNumber: 1,
    title: 'Calibración Técnica de Básculas Camioneras y Consolidación de Tiquetes',
    description: 'Inspección metrológica legal de básculas de entrada y extracción automática de datos del software de pesaje vehicular.',
    scheduledFrequency: 'Bimestral / Trimestral',
    scheduledMonth: 'Septiembre',
    dueDate: '2026-09-28',
    responsible: 'Jefe de Báscula & Operaciones',
    status: 'En curso',
    observations: 'Báscula 1 y Báscula 2 con certificado vigente hasta diciembre 2026.',
  }
];

// MÓDULO 3: Planes de Acción Estratégicos (Acciones de mejora para que el KPI se cumpla)
export const INITIAL_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'act-1',
    code: 'PLA-CAL-01',
    kpiId: 'kpi-1',
    kpiCode: 'KPI-CAL-01',
    kpiName: 'Índice de Satisfacción de Clientes y Comerciantes (121 Clientes)',
    name: 'Revisión, Modernización y Adecuación de Infraestructura Local y Baterías Sanitarias',
    activity: 'Intervención integral de iluminación LED en pabellones, repavimentación de pasillos de carga y remodelación completa de las 4 baterías sanitarias principales para los 121 comerciantes.',
    responsible: 'Ing. Javier Peña (Mantenimiento)',
    responsibleEmail: 'mantenimiento@granabastos.com.co',
    startDate: '2026-07-01',
    dueDate: '2026-11-30',
    progress: 65,
    status: 'En progreso',
    observations: 'Baterías del Bloque A y B 100% concluidas. Se trabaja en la iluminación del Bloque C.',
    evidenceUrl: 'https://drive.google.com/drive/folders/ejemploMantenimientoLocales',
    evidenceNotes: 'Actas de entrega de obra civil e informe de interventoría técnica.'
  },
  {
    id: 'act-2',
    code: 'PLA-FIN-01',
    kpiId: 'kpi-2',
    kpiCode: 'KPI-FIN-02',
    kpiName: 'Índice de Cartera Vencida (> 60 días)',
    name: 'Campaña Extraordinaria de Normalización de Cartera y Acuerdos de Pago Flexibles',
    activity: 'Establecer mesas individuales de concertación con los 14 principales comerciantes morosos, autorizando planes de pago a 12 meses sin causación de intereses de mora por cumplimiento estricto.',
    responsible: 'Dra. Claudia Ortiz (Financiera)',
    responsibleEmail: 'financiera@granabastos.com.co',
    startDate: '2026-08-01',
    dueDate: '2026-10-15',
    progress: 75,
    status: 'En progreso',
    observations: '9 acuerdos suscritos con garantías reales. 5 comerciantes en etapa de cobro prejurídico.',
    evidenceUrl: 'https://drive.google.com/drive/folders/ejemploCarteraAcuerdos',
    evidenceNotes: 'Actas notariales de compromiso y pagarés firmados.'
  },
  {
    id: 'act-3',
    code: 'PLA-COM-01',
    kpiId: 'kpi-3',
    kpiCode: 'KPI-COM-03',
    kpiName: 'Tasa de Ocupación de Bodegas y Locales',
    name: 'Rueda de Negocios Mayorista Región Caribe 2026',
    activity: 'Convocatoria a cooperativas agropecuarias de Santander, Boyacá y Magdalena para adjudicar los 31 locales disponibles mediante incentivos en los primeros 3 meses de arrendamiento.',
    responsible: 'Ing. Carlos Mendoza (Comercial)',
    responsibleEmail: 'comercial@granabastos.com.co',
    startDate: '2026-08-15',
    dueDate: '2026-09-30',
    progress: 90,
    status: 'En progreso',
    observations: '18 cartas de intención recibidas con anticipo de arrendamiento consignado.',
    evidenceUrl: 'https://drive.google.com/drive/folders/ejemploRuedaNegocios',
    evidenceNotes: 'Memorando comercial y contratos en revisión jurídica.'
  },
  {
    id: 'act-4',
    code: 'PLA-AMB-01',
    kpiId: 'kpi-5',
    kpiCode: 'KPI-AMB-05',
    kpiName: 'Tasa de Aprovechamiento de Residuos Orgánicos',
    name: 'Capacitación en Origen e Instalación de Estaciones Ecológicas en Pabellones',
    activity: 'Instalar 40 contenedores industriales diferenciados para frutas/verduras de merma y capacitar a cuadrillas de cargadores y puesteros.',
    responsible: 'Ing. Mateo Gómez (Ambiental)',
    responsibleEmail: 'ambiental@granabastos.com.co',
    startDate: '2026-07-15',
    dueDate: '2026-09-15',
    progress: 100,
    status: 'Completada',
    observations: 'Plan 100% ejecutado. Reducción comprobada del 20% en residuos enviados a relleno sanitario.',
    evidenceUrl: 'https://drive.google.com/file/d/ejemploCertificadoAmbiental/view',
    evidenceNotes: 'Certificado de aprovechamiento emitido por la empresa de biotransformación.'
  }
];

// MÓDULO 4: Plan y Cronograma de las Acciones de la Gestión de las Áreas (POA Institucional)
export const INITIAL_AREA_TASKS: AreaManagementTask[] = [
  {
    id: 'poa-1',
    code: 'POA-OPE-01',
    area: 'Operaciones & Logística',
    processName: 'Gestión de Tráfico y Básculas Camioneras',
    activity: 'Actualización y mantenimiento del software de pesaje de básculas y lectores automáticos de placas para reducir tiempo de espera en Puerta 1',
    responsible: 'Dr. Hernando Valdés',
    responsibleEmail: 'operaciones@granabastos.com.co',
    quarter: 'T3',
    year: 2026,
    startDate: '2026-07-01',
    dueDate: '2026-09-30',
    progress: 70,
    status: 'En progreso',
    deliverables: 'Manual de usuario del software y acta de instalación de barreras vehiculares.',
    linkedKpiCode: 'KPI-OPE-04',
    evidenceUrl: 'https://drive.google.com/drive/folders/poa-operaciones'
  },
  {
    id: 'poa-2',
    code: 'POA-CAL-02',
    area: 'Gestión Humana & Calidad',
    processName: 'Sistema de Gestión de Calidad (SGC ISO 9001:2015)',
    activity: 'Auditoría interna de calidad a los procesos misionales de comercialización, pesaje y mantenimiento general',
    responsible: 'Lic. Martha Restrepo',
    responsibleEmail: 'calidad@granabastos.com.co',
    quarter: 'T3',
    year: 2026,
    startDate: '2026-08-01',
    dueDate: '2026-09-25',
    progress: 85,
    status: 'En progreso',
    deliverables: 'Informe de auditoría interna y matriz de hallazgos para revisión por la Dirección.',
    linkedKpiCode: 'KPI-CAL-01',
    evidenceUrl: 'https://drive.google.com/drive/folders/poa-calidad-auditoria'
  },
  {
    id: 'poa-3',
    code: 'POA-FIN-03',
    area: 'Financiera & Administrativa',
    processName: 'Presupuesto y Tesorería',
    activity: 'Preparación del Anteproyecto de Presupuesto de Ingresos y Gastos para la vigencia 2027 conforme al Plan Estratégico 2028',
    responsible: 'Dra. Claudia Ortiz',
    responsibleEmail: 'financiera@granabastos.com.co',
    quarter: 'T3',
    year: 2026,
    startDate: '2026-08-15',
    dueDate: '2026-10-30',
    progress: 40,
    status: 'En progreso',
    deliverables: 'Documento borrador del presupuesto y proyecciones de flujo de caja.',
    linkedKpiCode: 'KPI-FIN-02',
    evidenceUrl: 'https://drive.google.com/drive/folders/poa-presupuesto-2027'
  },
  {
    id: 'poa-4',
    code: 'POA-MNT-04',
    area: 'Operaciones & Logística',
    processName: 'Mantenimiento de Cuartos Fríos',
    activity: 'Prueba hidrostática y recarga de refrigerante ecológico en túneles de frío y cámaras de maduración de plátano',
    responsible: 'Ing. Javier Peña',
    responsibleEmail: 'mantenimiento@granabastos.com.co',
    quarter: 'T2',
    year: 2026,
    startDate: '2026-05-01',
    dueDate: '2026-06-20',
    progress: 100,
    status: 'Completada',
    deliverables: 'Certificado de hermeticidad y registro de horómetros de compresores.',
    linkedKpiCode: 'KPI-OPE-04',
    evidenceUrl: 'https://drive.google.com/drive/folders/poa-mantenimiento-frio'
  },
  {
    id: 'poa-5',
    code: 'POA-AMB-05',
    area: 'Sostenibilidad & Ambiental',
    processName: 'Gestión Ambiental y Aguas Residuales',
    activity: 'Monitoreo de vertimientos de la Planta de Tratamiento de Aguas Residuales (PTAR) ante la autoridad ambiental CRA',
    responsible: 'Ing. Mateo Gómez',
    responsibleEmail: 'ambiental@granabastos.com.co',
    quarter: 'T3',
    year: 2026,
    startDate: '2026-07-10',
    dueDate: '2026-09-15',
    progress: 100,
    status: 'Completada',
    deliverables: 'Reporte de laboratorio acreditado por el IDEAM y radicado ante la CRA.',
    linkedKpiCode: 'KPI-AMB-05',
    evidenceUrl: 'https://drive.google.com/drive/folders/poa-ambiental-cra'
  },
  {
    id: 'poa-6',
    code: 'POA-GER-06',
    area: 'Gerencia General',
    processName: 'Gobierno Corporativo y Planeación 2028',
    activity: 'Junta Directiva Ordinaria de seguimiento al avance del Plan Estratégico Granabastos Visión 2028 y evaluación del corte T2',
    responsible: 'Secretaría de Gerencia & Gerente General',
    responsibleEmail: 'sec_gerencia@granabastos.com.co',
    quarter: 'T3',
    year: 2026,
    startDate: '2026-07-20',
    dueDate: '2026-08-10',
    progress: 100,
    status: 'Completada',
    deliverables: 'Acta de Junta Directiva No. 348 firmada con aprobación de informe trimestral.',
    linkedKpiCode: 'KPI-CAL-01',
    evidenceUrl: 'https://drive.google.com/drive/folders/poa-junta-directiva'
  }
];

export const GRANABASTOS_AREAS = [
  'Gestión Humana & Calidad',
  'Operaciones & Logística',
  'Comercial & Mercadeo',
  'Financiera & Administrativa',
  'Sostenibilidad & Ambiental',
  'Gerencia General'
];

export const PERIODICITIES: Array<'Mensual' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual'> = [
  'Trimestral',
  'Mensual',
  'Bimestral',
  'Semestral',
  'Anual'
];

export const QUARTERS: Array<'T1' | 'T2' | 'T3' | 'T4'> = ['T1', 'T2', 'T3', 'T4'];
export const YEARS_HORIZON_2028 = [2024, 2025, 2026, 2027, 2028];
