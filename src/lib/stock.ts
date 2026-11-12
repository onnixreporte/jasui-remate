import fs from 'node:fs';
import path from 'node:path';
import raw from '../data/stock.csv?raw';

export interface Producto {
  sku: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  precioAnterior: number;
  stock: number;
  foto: string;
}

// Acepta coma o punto y coma (Excel en español exporta con ;) y campos entre comillas.
function parseCSV(text: string): string[][] {
  text = text.replace(/^﻿/, '');
  const head = text.split('\n', 1)[0];
  const sep = head.split(';').length > head.split(',').length ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += c;
    } else if (c === '"' && cell === '') quoted = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim()));
}

// Descarta decimales (1278601.2) y separadores de miles (1.278.601).
const num = (v = '') => Number(v.trim().replace(/[.,]\d{1,2}$/, '').replace(/[^\d]/g, '')) || 0;

export function getProductos(): Producto[] {
  const [header, ...rows] = parseCSV(raw);
  const idx = Object.fromEntries(header.map((h, i) => [h.trim().toLowerCase(), i]));
  const get = (r: string[], k: string) => (r[idx[k]] ?? '').trim();
  return rows.map((r) => {
    let foto = get(r, 'foto');
    if (foto && !/^https?:\/\//.test(foto)) {
      foto = '/' + foto.replace(/^\/+/, '');
      if (!fs.existsSync(path.join(process.cwd(), 'public', foto))) foto = '';
    }
    return {
      sku: get(r, 'sku'),
      nombre: get(r, 'nombre'),
      categoria: get(r, 'categoria') || 'Otros',
      descripcion: get(r, 'descripcion'),
      precio: num(get(r, 'precio')),
      precioAnterior: num(get(r, 'precio_anterior')),
      stock: num(get(r, 'stock')),
      foto,
    };
  });
}

export const gs = (n: number) => 'Gs. ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
