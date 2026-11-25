# Remate interno Yasui

Catálogo estático (Astro). Deploy en Vercel sin configuración.

## Actualizar stock

El stock se lee del Google Sheet configurado en `src/config.ts` (`sheetId`) cada vez que se publica la web.
La hoja debe estar compartida como "cualquiera con el enlace puede ver".

- Al editar la hoja, la web se republica sola en 1–2 minutos (script en `scripts/google-sheet-deploy.gs`,
  instalado en la hoja vía Extensiones → Apps Script). También hay un menú **Web → Publicar ahora** en la hoja.
- Si no se puede leer la hoja, se usa `src/data/stock.csv` como respaldo.

Columnas (primera fila de la hoja):

`sku, nombre, categoria, descripcion, precio, precio_anterior, stock, foto`

- `foto`: ruta dentro de `public/` (ej: `productos/it1.jpg`) o URL. Vacío = placeholder.
- `stock` 0 = "Agotado".

## Logo y contacto

- Logo: poner `public/logo.svg` (o `.png` / `.webp`).
- WhatsApp y textos: `src/config.ts`.

## Desarrollo

```
npm install
npm run dev
```
