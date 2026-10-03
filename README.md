# Granabastos KPI Frontend

Frontend de gestión de KPIs y planes de acción, conectado con la API NestJS del proyecto.

## Ejecución local

Requisitos: Node.js y la API iniciada y configurada. Desde esta carpeta:

1. Instala dependencias: `npm install`.
2. Copia `.env.example` a `.env.local` y configura `VITE_API_BASE_URL` con la URL de la API, incluido `/api` (por defecto `http://localhost:3001/api`).
3. Asegúrate de que `FRONTEND_URL` en la configuración de la API coincida con el origen de Vite (`http://localhost:3000` por defecto).
4. Inicia la aplicación: `npm run dev`.
5. Inicia sesión con una cuenta creada en la API.

Los KPIs, mediciones, tareas, planes, alertas y evidencias se consultan en la API. Las evidencias requieren que Google Drive esté configurado en el servidor. La importación masiva y la restauración de datos de demostración requieren endpoints que la API todavía no expone.
