# Remate interno Yasui

Catálogo estático (Astro). Deploy en Vercel sin configuración.

## Actualizar stock

Editar `src/data/stock.csv` y hacer push. Columnas:

`sku, nombre, categoria, descripcion, precio, precio_anterior, stock, foto`

- Separador `,` o `;` (Excel), ambos funcionan.
- `foto`: ruta dentro de `public/` (ej: `productos/JS-001.jpg`) o URL. Vacío = placeholder.
- `stock` 0 = "Agotado".

## Logo y contacto

- Logo: poner `public/logo.svg` (o `.png` / `.webp`).
- WhatsApp y textos: `src/config.ts`.

## Desarrollo

```
npm install
npm run dev
```
